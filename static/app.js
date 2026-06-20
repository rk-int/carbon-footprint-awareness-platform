document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('footprint-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnLoader = document.getElementById('btn-loader');
    const resultCard = document.getElementById('result-card');
    const initialMsg = document.getElementById('initial-msg');
    const resultContent = document.getElementById('result-content');
    const gaugeValue = document.getElementById('gauge-value');
    const gaugeFill = document.getElementById('gauge-fill');
    const comparisonText = document.getElementById('comparison-text');
    const breakdownBody = document.getElementById('breakdown-body');
    const insightsCard = document.getElementById('insights-card');
    const insightsBody = document.getElementById('insights-body');
    const bgGlow = document.getElementById('bg-glow');

    // Total path length of the gauge arc (dasharray = 251.2)
    const GAUGE_MAX_LEN = 251.2;
    const MAX_FOOTPRINT_LIMIT = 50.0; // The ceiling for the gauge representation

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        btnLoader.style.display = 'inline-block';
        submitBtn.querySelector('.btn-text').textContent = 'Analyzing...';

        // Extract form values
        const formData = new FormData(form);
        const requestData = {
            transport_car_miles: parseFloat(formData.get('transport_car_miles')) || 0,
            transport_transit_miles: parseFloat(formData.get('transport_transit_miles')) || 0,
            energy_electricity_kwh: parseFloat(formData.get('energy_electricity_kwh')) || 0,
            diet_type: formData.get('diet_type'),
            waste_recycles: formData.get('waste_recycles') === 'on' || form.elements['waste_recycles'].checked
        };

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Analysis request failed.');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error analyzing footprint:', error);
            alert('We encountered a problem calculating your footprint. Please try again.');
        } finally {
            // Reset button loading state
            submitBtn.disabled = false;
            btnLoader.style.display = 'none';
            submitBtn.querySelector('.btn-text').textContent = 'Reveal Footprint';
        }
    });

    function displayResults(data) {
        // Remove initial state placeholder
        resultCard.classList.remove('initial-state');
        initialMsg.classList.add('hidden');
        resultContent.classList.remove('hidden');

        // Animate gauge value
        animateNumber(0, data.estimated_total, gaugeValue);

        // Animate gauge arc fill
        const percentage = Math.min(data.estimated_total / MAX_FOOTPRINT_LIMIT, 1);
        const dashOffset = GAUGE_MAX_LEN - (percentage * GAUGE_MAX_LEN);
        gaugeFill.style.strokeDashoffset = dashOffset;

        // Shift background ambient light based on total footprint severity
        updateAmbientBackground(data.estimated_total);

        // Set comparison descriptor text
        setComparisonText(data.estimated_total);

        // Build Breakdown Table
        breakdownBody.innerHTML = '';
        for (const [category, emissions] of Object.entries(data.breakdown)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category}</td>
                <td class="text-right"><strong>${emissions.toFixed(2)}</strong></td>
            `;
            breakdownBody.appendChild(row);
        }

        // Show and populate Gemini Insights
        insightsCard.classList.remove('hidden');
        
        let insightsHtml = "";
        if (data.insights && data.insights.carbon_analysis) {
            insightsHtml += `<h3>A Moment of Reflection</h3>`;
            insightsHtml += `<p>${data.insights.carbon_analysis}</p>`;
        }
        
        if (data.insights && Array.isArray(data.insights.actionable_steps)) {
            insightsHtml += `<h3>Actionable Changes</h3>`;
            insightsHtml += `<ul>`;
            data.insights.actionable_steps.forEach(step => {
                insightsHtml += `<li><strong>${step.habit_change}</strong> (Saves ~${step.estimated_impact_kg} kg CO₂e)</li>`;
            });
            insightsHtml += `</ul>`;
        }
        
        insightsBody.innerHTML = insightsHtml;

        // Smooth scroll to results
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function animateNumber(start, end, element) {
        let current = start;
        const duration = 1500; // ms
        const stepTime = 30; // ms
        const steps = duration / stepTime;
        const increment = (end - start) / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                element.textContent = end.toFixed(2);
            } else {
                element.textContent = current.toFixed(2);
            }
        }, stepTime);
    }

    function updateAmbientBackground(total) {
        if (total < 8) {
            // Sage theme background glow
            bgGlow.style.background = 'radial-gradient(circle, hsla(95, 25%, 85%, 0.4) 0%, hsla(34, 45%, 97%, 0) 70%)';
        } else if (total < 20) {
            // Gold theme background glow
            bgGlow.style.background = 'radial-gradient(circle, hsla(36, 40%, 85%, 0.4) 0%, hsla(34, 45%, 97%, 0) 70%)';
        } else {
            // Terracotta theme background glow
            bgGlow.style.background = 'radial-gradient(circle, hsla(12, 35%, 85%, 0.4) 0%, hsla(34, 45%, 97%, 0) 70%)';
        }
    }

    function setComparisonText(total) {
        let text = "";
        if (total < 5) {
            text = "✨ Your daily carbon footprint is exceptionally low. This aligns with sustainable global targets to combat climate change. Beautiful work.";
        } else if (total < 11) {
            text = "🌿 Your footprint is lower than the global daily average of 11 kg CO₂e. You are walking lightly, with opportunities to reduce further.";
        } else if (total < 35) {
            text = "⚡ Your footprint is moderate. While you are below the US daily average of 44 kg CO₂e, there is meaningful room to decrease your daily impact.";
        } else {
            text = "🔥 Your daily footprint is higher than average. Simple changes in your transportation or diet could yield significant savings for our planet.";
        }
        comparisonText.textContent = text;
    }

    function parseMarkdown(text) {
        if (!text) return "";
        
        // Simple and robust parser for headers, lists, and bold text
        const lines = text.split('\n');
        let html = "";
        let insideList = false;

        for (let line of lines) {
            line = line.trim();
            if (!line) {
                if (insideList) {
                    html += "</ul>";
                    insideList = false;
                }
                continue;
            }

            // Headers
            if (line.startsWith('### ')) {
                if (insideList) { html += "</ul>"; insideList = false; }
                html += `<h3>${line.substring(4)}</h3>`;
            } else if (line.startsWith('## ')) {
                if (insideList) { html += "</ul>"; insideList = false; }
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.startsWith('# ')) {
                if (insideList) { html += "</ul>"; insideList = false; }
                html += `<h1>${line.substring(2)}</h1>`;
            }
            // Bullet points
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                if (!insideList) {
                    html += "<ul>";
                    insideList = true;
                }
                html += `<li>${inlineMarkdown(line.substring(2))}</li>`;
            }
            // Normal paragraph
            else {
                if (insideList) { html += "</ul>"; insideList = false; }
                html += `<p>${inlineMarkdown(line)}</p>`;
            }
        }

        if (insideList) {
            html += "</ul>";
        }

        return html;
    }

    function inlineMarkdown(text) {
        // Parse bold text (**bold**)
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
});
