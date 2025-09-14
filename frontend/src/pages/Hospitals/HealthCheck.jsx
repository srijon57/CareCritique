import { useState } from "react";

const HealthCheck = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [results, setResults] = useState(null);

  const calculateHealth = () => {
    if (!height || !weight || !systolic || !diastolic) {
      alert("Please fill in all fields.");
      return;
    }

    // Calculate BMI
    const heightMeters = height / 100;
    const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi >= 18.5 && bmi < 25) bmiCategory = "Normal";
    else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // Blood Pressure Category
    let bpCategory = "";
    if (systolic < 120 && diastolic < 80) bpCategory = "Normal";
    else if (systolic >= 120 && systolic < 130 && diastolic < 80)
      bpCategory = "Elevated";
    else if (
      (systolic >= 130 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    )
      bpCategory = "Hypertension Stage 1";
    else if (
      (systolic >= 140 && systolic < 180) ||
      (diastolic >= 90 && diastolic < 120)
    )
      bpCategory = "Hypertension Stage 2";
    else if (systolic >= 180 || diastolic >= 120)
      bpCategory = "Hypertensive Crisis";
    else bpCategory = "Unknown";

    // Risk factors based on BMI + BP
    const riskFactors = [];
    if (bmiCategory === "Underweight") {
      riskFactors.push("Possible nutrient deficiency and weakened immunity.");
    } else if (bmiCategory === "Overweight") {
      riskFactors.push("Higher risk of diabetes and heart disease.");
    } else if (bmiCategory === "Obese") {
      riskFactors.push(
        "Increased risk of heart disease, stroke, and metabolic syndrome."
      );
    }

    if (bpCategory === "Elevated") {
      riskFactors.push("May develop hypertension if lifestyle is not improved.");
    } else if (bpCategory.includes("Stage 1")) {
      riskFactors.push("Moderate risk of cardiovascular disease.");
    } else if (bpCategory.includes("Stage 2")) {
      riskFactors.push("High risk of heart attack, stroke, and organ damage.");
    } else if (bpCategory === "Hypertensive Crisis") {
      riskFactors.push("Seek emergency medical care immediately!");
    }

    setResults({ bmi, bmiCategory, bpCategory, riskFactors });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-cyan-700 dark:bg-gray-800 text-white py-12 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Health Check</h1>
          <p className="text-cyan-100 dark:text-gray-300 max-w-2xl">
            Enter your details to calculate BMI and evaluate your blood pressure
            level. You'll also see potential risk factors.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Systolic (mmHg)
              </label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <button
            onClick={calculateHealth}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Your Results</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">BMI:</span>
                <span
                  className={`px-4 py-1 rounded-lg font-bold ${
                    results.bmiCategory === "Normal"
                      ? "bg-green-200 text-green-800"
                      : results.bmiCategory === "Underweight"
                      ? "bg-yellow-200 text-yellow-800"
                      : results.bmiCategory === "Overweight"
                      ? "bg-orange-200 text-orange-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {results.bmi} ({results.bmiCategory})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Blood Pressure:</span>
                <span
                  className={`px-4 py-1 rounded-lg font-bold ${
                    results.bpCategory === "Normal"
                      ? "bg-green-200 text-green-800"
                      : results.bpCategory === "Elevated"
                      ? "bg-yellow-200 text-yellow-800"
                      : results.bpCategory.includes("Stage")
                      ? "bg-orange-200 text-orange-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {results.bpCategory}
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            {results.riskFactors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-red-600 dark:text-red-400">
                  Potential Risk Factors
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {results.riskFactors.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Reference Tables */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">BMI Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <b>Underweight:</b> &lt; 18.5
              </li>
              <li>
                <b>Normal:</b> 18.5 – 24.9
              </li>
              <li>
                <b>Overweight:</b> 25 – 29.9
              </li>
              <li>
                <b>Obese:</b> 30 or higher
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Blood Pressure Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <b>Normal:</b> &lt;120 / &lt;80
              </li>
              <li>
                <b>Elevated:</b> 120-129 / &lt;80
              </li>
              <li>
                <b>Hypertension Stage 1:</b> 130-139 / 80-89
              </li>
              <li>
                <b>Hypertension Stage 2:</b> 140-179 / 90-119
              </li>
              <li>
                <b>Hypertensive Crisis:</b> ≥180 / ≥120
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
