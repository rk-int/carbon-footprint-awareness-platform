from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@patch('main.GenerativeModel')
def test_analyze_footprint(mock_generative_model):
    # Setup mock response for Vertex AI
    mock_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = '{"carbon_analysis": "Test reflection text", "actionable_steps": [{"habit_change": "Use public transit", "estimated_impact_kg": 2.5}]}'
    mock_instance.generate_content.return_value = mock_response
    mock_generative_model.return_value = mock_instance
    
    # Send a request
    payload = {
        "transport_car_miles": 10.0,
        "transport_transit_miles": 5.0,
        "energy_electricity_kwh": 10.0,
        "diet_type": "vegan",
        "waste_recycles": True
    }
    
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    
    json_data = response.json()
    assert "estimated_total" in json_data
    assert "breakdown" in json_data
    assert "insights" in json_data
    
    # Check calculated total:
    # car_emissions = 10 * 0.404 = 4.04
    # transit_emissions = 5 * 0.14 = 0.7
    # electricity_emissions = 10 * 0.386 = 3.86
    # diet_emissions = 2.9 (vegan)
    # waste_val = 0.8 - 0.5 = 0.3
    # Total = 4.04 + 0.7 + 3.86 + 2.9 + 0.3 = 11.8 kg CO2e
    assert json_data["estimated_total"] == 11.8
    print("Test passed successfully! Calculated total footprint matches expected value: 11.8 kg CO2e")

if __name__ == "__main__":
    test_analyze_footprint()
