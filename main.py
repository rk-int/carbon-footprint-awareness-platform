import os
import google.auth
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
import vertexai
from vertexai.generative_models import GenerativeModel

# Try to initialize Google Cloud project from credentials
try:
    _, default_project_id = google.auth.default()
except Exception:
    default_project_id = None

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCP_PROJECT") or default_project_id or "carbon-footprint-5739"
LOCATION = os.environ.get("GCP_LOCATION", "us-central1")

# Initialize Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
except Exception as e:
    print(f"Warning: Failed to initialize Vertex AI with project {PROJECT_ID}: {e}")

app = FastAPI(
    title="Carbon Footprint Awareness Platform",
    description="A reflective, empathetic web application to track and understand carbon footprints with Gemini AI."
)

class FootprintInput(BaseModel):
    transport_car_miles: float = Field(..., ge=0, description="Daily miles driven in a private vehicle")
    transport_transit_miles: float = Field(..., ge=0, description="Daily miles in public transit")
    energy_electricity_kwh: float = Field(..., ge=0, description="Daily household electricity consumption in kWh")
    diet_type: str = Field(..., description="Dietary habit: vegan, vegetarian, moderate-meat, heavy-meat")
    waste_recycles: bool = Field(..., description="Whether the user recycles household waste")

class FootprintResult(BaseModel):
    estimated_total: float
    breakdown: dict
    insights: str

@app.post("/api/analyze", response_model=FootprintResult)
async def analyze_footprint(data: FootprintInput):
    # Footprint calculation logic (in kg CO2e per day)
    car_factor = 0.404  # average US passenger car emissions per mile
    transit_factor = 0.14  # average public transit emissions per passenger mile
    electricity_factor = 0.386  # average electricity grid emissions per kWh in kg CO2e
    
    diet_factors = {
        "vegan": 2.9,
        "vegetarian": 3.8,
        "moderate-meat": 5.6,
        "heavy-meat": 7.2
    }
    
    # Recycling reduces household waste impact
    waste_baseline = 0.8  # kg CO2e per day for garbage
    waste_reduction = 0.5  # recycling saving
    waste_val = waste_baseline - (waste_reduction if data.waste_recycles else 0)
    
    car_emissions = data.transport_car_miles * car_factor
    transit_emissions = data.transport_transit_miles * transit_factor
    electricity_emissions = data.energy_electricity_kwh * electricity_factor
    diet_emissions = diet_factors.get(data.diet_type, 5.6)
    
    total_footprint = car_emissions + transit_emissions + electricity_emissions + diet_emissions + waste_val
    
    # Formulate custom prompts for Gemini
    prompt = f"""
You are an empathetic, encouraging, and expert environmental guide assisting individuals in understanding and reducing their carbon footprint.
The user has provided the following profile of their daily activities:
- Private vehicle driving: {data.transport_car_miles} miles/day
- Public transit use: {data.transport_transit_miles} miles/day
- Electricity usage: {data.energy_electricity_kwh} kWh/day
- Diet preference: {data.diet_type}
- Recycles waste: {'Yes' if data.waste_recycles else 'No'}

Based on these inputs, their estimated daily carbon footprint is {total_footprint:.2f} kg CO2e (kilograms of CO2 equivalent). 
For context:
- The global daily average is approximately 11 kg CO2e per person.
- The average US daily footprint is around 44 kg CO2e.
- A sustainable target is under 5 kg CO2e per day.

Please analyze this footprint and write a response containing exactly these three markdown sections:
1. **### A Moment of Reflection**: A warm, positive, and non-judgmental validation of where they stand. Help them feel connected to the environment and reflect on how their choices influence the world around them.
2. **### Actionable Changes**: Suggest exactly 3 practical, meaningful, and highly personalized changes they can make based on their specific inputs to reduce their footprint. Give realistic estimated savings for each.
3. **### A Shared Journey**: A final, beautiful paragraph of encouragement that connects their personal steps to our collective progress as a planet.

Keep the tone reflective, minimal, and warm. Format your response in clean markdown. Do not include introductory conversational fluff or outer wrapper tags.
"""

    insights = ""
    try:
        model = GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        insights = response.text
    except Exception as e:
        print(f"Error calling Vertex AI: {e}")
        insights = (
            "### A Moment of Reflection\n\n"
            "Thank you for taking this mindful step to look at your daily footprint. "
            "Although we couldn't connect to our AI guide right now, your awareness is a powerful catalyst for change.\n\n"
            "### Actionable Changes\n\n"
            "1. **Mindful Transport**: Every mile you shift from a private vehicle to transit, biking, or walking saves about 0.3 kg of CO2.\n"
            "2. **Power Down**: Small adjustments in energy usage, like switching off idle appliances or air drying clothes, compound into major savings.\n"
            "3. **Plant-Forward Meals**: Swapping even one meat-heavy meal a day for a plant-based alternative can reduce your diet footprint by 20%.\n\n"
            "### A Shared Journey\n\n"
            "Every step, no matter how small, is a step towards a healthier, more balanced earth. Thank you for your care."
        )
        
    return FootprintResult(
        estimated_total=round(total_footprint, 2),
        breakdown={
            "Transport (Car)": round(car_emissions, 2),
            "Transport (Transit)": round(transit_emissions, 2),
            "Electricity": round(electricity_emissions, 2),
            "Diet": round(diet_emissions, 2),
            "Waste": round(waste_val, 2)
        },
        insights=insights
    )

# Mount static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
