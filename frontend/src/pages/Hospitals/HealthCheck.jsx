import { useState } from "react";

const HealthCheck = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("Good");
  const [sleepIssues, setSleepIssues] = useState([]);
  const [results, setResults] = useState(null);

  const calculateHealth = () => {
    if (!height || !weight || !systolic || !diastolic || !sleepHours) {
      alert("Please fill in all required fields.");
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

    // Sleep Assessment
    const sleepHoursNum = parseFloat(sleepHours);
    let sleepAssessment = "";
    let sleepRisk = "";
    let sleepSuggestions = [];

    if (sleepHoursNum < 6) {
      sleepAssessment = "Insufficient Sleep";
      sleepRisk = "High risk of sleep deprivation";
      sleepSuggestions = [
        "Aim for 7-9 hours of sleep per night",
        "Maintain a consistent sleep schedule",
        "Avoid caffeine and screens before bedtime"
      ];
    } else if (sleepHoursNum >= 6 && sleepHoursNum <= 9) {
      sleepAssessment = "Adequate Sleep";
      sleepRisk = "Low risk";
      sleepSuggestions = [
        "Maintain your healthy sleep habits",
        "Continue with your consistent sleep schedule"
      ];
    } else {
      sleepAssessment = "Excessive Sleep";
      sleepRisk = "Potential underlying health issues";
      sleepSuggestions = [
        "Consult with a healthcare provider about your sleep patterns",
        "Consider a sleep study if you frequently need more than 9 hours"
      ];
    }

    // Adjust based on sleep quality
    if (sleepQuality === "Poor") {
      sleepRisk = sleepRisk + " with poor sleep quality";
      sleepSuggestions.push(
        "Create a relaxing bedtime routine",
        "Ensure your sleep environment is dark, quiet, and cool"
      );
    }

    // Adjust based on sleep issues
    if (sleepIssues.includes("Insomnia")) {
      sleepSuggestions.push(
        "Consider cognitive behavioral therapy for insomnia (CBT-I)",
        "Avoid long naps during the day"
      );
    }
    if (sleepIssues.includes("Snoring")) {
      sleepSuggestions.push(
        "Consider a sleep study to rule out sleep apnea",
        "Try sleeping on your side instead of your back"
      );
    }
    if (sleepIssues.includes("Restless")) {
      sleepSuggestions.push(
        "Reduce caffeine and alcohol intake",
        "Consider iron levels as restless legs can be related to deficiency"
      );
    }

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

    setResults({ 
      bmi, 
      bmiCategory, 
      bpCategory, 
      riskFactors,
      sleepAssessment,
      sleepRisk,
      sleepSuggestions
    });
  };

  const handleSleepIssueChange = (issue) => {
    if (sleepIssues.includes(issue)) {
      setSleepIssues(sleepIssues.filter(item => item !== issue));
    } else {
      setSleepIssues([...sleepIssues, issue]);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-cyan-700 dark:bg-gray-800 text-white py-12 shadow-md">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Health Check</h1>
          <p className="text-cyan-100 dark:text-gray-300 max-w-2xl">
            Enter your details to calculate BMI, evaluate your blood pressure
            level, and assess your sleep health. You`ll also see potential risk factors and suggestions.
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
            
            {/* Sleep Assistant Section */}
            <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Sleep Assessment</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Average Sleep Hours (per night)*
                  </label>
                  <input
                    type="number"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Sleep Quality
                  </label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Sleep Issues (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Insomnia", "Snoring", "Restless", "Nightmares", "None"].map((issue) => (
                      <label key={issue} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={sleepIssues.includes(issue)}
                          onChange={() => handleSleepIssueChange(issue)}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{issue}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
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
            
            {/* BMI and BP Results */}
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

            {/* Sleep Results */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3 text-cyan-700 dark:text-cyan-400">
                Sleep Assessment
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Assessment:</span>
                <span
                  className={`px-4 py-1 rounded-lg font-bold ${
                    results.sleepAssessment === "Adequate Sleep"
                      ? "bg-green-200 text-green-800"
                      : results.sleepAssessment === "Insufficient Sleep"
                      ? "bg-orange-200 text-orange-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {results.sleepAssessment}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-medium">Risk Level: </span>
                <span className={
                  results.sleepRisk.includes("High") 
                    ? "text-red-600 dark:text-red-400" 
                    : results.sleepRisk.includes("Low")
                    ? "text-green-600 dark:text-green-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }>
                  {results.sleepRisk}
                </span>
              </div>
              {results.sleepSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggestions:</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {results.sleepSuggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Risk Factors */}
            {results.riskFactors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-red-600 dark:text-red-400">
                  Potential Health Risk Factors
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

        {/* Sleep Reference Table */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Sleep Health Guidelines</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <b>Adults (18-64 years):</b> 7-9 hours per night
            </li>
            <li>
              <b>Older Adults (65+ years):</b> 7-8 hours per night
            </li>
            <li>
              <b>Consistent schedule:</b> Going to bed and waking up at the same time helps regulate your body`s clock
            </li>
            <li>
              <b>Sleep environment:</b> Cool, dark, and quiet rooms promote better sleep
            </li>
            <li>
              <b>Limit screen time:</b> Avoid screens 1 hour before bedtime
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;