const fs = require('fs');
const path = require('path');

class FloodRiskPredictor {
  constructor() {
    this.model = null;
    this.trainingData = [];
    this.weights = {
      rainfall: 0.4,
      waterLevel: 0.4,
      elevation: 0.2
    };
    this.scalingFactors = {
      rainfall: { min: 0, max: 500 },
      waterLevel: { min: 0, max: 100 },
      elevation: { min: 0, max: 1000 }
    };
  }

  normalizeValue(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  predictRisk(rainfall, waterLevel, elevation) {
    const normalizedRainfall = this.normalizeValue(
      rainfall,
      this.scalingFactors.rainfall.min,
      this.scalingFactors.rainfall.max
    );
    const normalizedWaterLevel = this.normalizeValue(
      waterLevel,
      this.scalingFactors.waterLevel.min,
      this.scalingFactors.waterLevel.max
    );
    const normalizedElevation = this.normalizeValue(
      elevation,
      this.scalingFactors.elevation.min,
      this.scalingFactors.elevation.max
    );

    const riskScore = (
      normalizedRainfall * this.weights.rainfall * 100 +
      normalizedWaterLevel * this.weights.waterLevel * 100 +
      (1 - normalizedElevation) * this.weights.elevation * 100
    );

    const clampedScore = Math.min(100, Math.max(0, riskScore));

    let riskLevel;
    if (clampedScore < 30) riskLevel = 'Low';
    else if (clampedScore < 55) riskLevel = 'Moderate';
    else if (clampedScore < 75) riskLevel = 'High';
    else riskLevel = 'Critical';

    return {
      riskScore: Math.round(clampedScore * 10) / 10,
      riskLevel,
      confidence: 0.85
    };
  }

  trainModel(trainingData) {
    this.trainingData = trainingData;
    
    if (trainingData.length === 0) {
      console.log('No training data provided, using default weights');
      return;
    }

    let rainfallSum = 0, waterLevelSum = 0, elevationSum = 0;
    let rainfallMax = 0, waterLevelMax = 0, elevationMax = 0;
    let rainfallMin = Infinity, waterLevelMin = Infinity, elevationMin = Infinity;

    trainingData.forEach(data => {
      rainfallSum += data.rainfall || 0;
      waterLevelSum += data.waterLevel || 0;
      elevationSum += data.elevation || 0;

      rainfallMax = Math.max(rainfallMax, data.rainfall || 0);
      waterLevelMax = Math.max(waterLevelMax, data.waterLevel || 0);
      elevationMax = Math.max(elevationMax, data.elevation || 0);

      rainfallMin = Math.min(rainfallMin, data.rainfall || 0);
      waterLevelMin = Math.min(waterLevelMin, data.waterLevel || 0);
      elevationMin = Math.min(elevationMin, data.elevation || 0);
    });

    this.scalingFactors = {
      rainfall: { min: rainfallMin, max: rainfallMax },
      waterLevel: { min: waterLevelMin, max: waterLevelMax },
      elevation: { min: elevationMin, max: elevationMax }
    };

    console.log('Model trained with scaling factors:', this.scalingFactors);
  }

  updateWeights(newWeights) {
    if (newWeights.rainfall) this.weights.rainfall = newWeights.rainfall;
    if (newWeights.waterLevel) this.weights.waterLevel = newWeights.waterLevel;
    if (newWeights.elevation) this.weights.elevation = newWeights.elevation;

    const total = this.weights.rainfall + this.weights.waterLevel + this.weights.elevation;
    this.weights.rainfall /= total;
    this.weights.waterLevel /= total;
    this.weights.elevation /= total;

    console.log('Weights updated:', this.weights);
  }

  getModelInfo() {
    return {
      trainingDataPoints: this.trainingData.length,
      weights: this.weights,
      scalingFactors: this.scalingFactors,
      modelType: 'Weighted Linear Regression',
      version: '1.0'
    };
  }

  batchPredict(predictions) {
    return predictions.map(p => ({
      ...p,
      prediction: this.predictRisk(p.rainfall, p.waterLevel, p.elevation)
    }));
  }
}

module.exports = FloodRiskPredictor;
