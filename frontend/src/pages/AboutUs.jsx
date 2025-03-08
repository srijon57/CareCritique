import "react";

const teamMembers = [
  {
    id: "20220104120",
    name: "Zawad Al Mahi",
    email: "zawadalmahi@gmail.com",
    username: "zawadalmahi",
    role: "Frontend + Backend",
    img: "/src/assets/mahi.jpg", // Change to actual image path
  },
  {
    id: "20220104123",
    name: "Abdullah Al Jubayer",
    email: "abdullahaljubair2019@gmail.com",
    username: "abduillahaljubair",
    role: "Frontend + Backend",
    img: "/src/assets/icon1.jpg", // Change to actual image path
  },
  {
    id: "20220104124",
    name: "KM Hasibur Rahman Srijon",
    email: "srijond57@gmail.com",
    username: "srijon57",
    role: "Lead",
    img: "/src/assets/srijon.jpg", // Change to actual image path
  },
  {
    id: "20210204077",
    name: "Rakibul Islam Rahi",
    email: "rakibulislam.rahi.rir@gmail.com",
    username: "Rakibul-rahi",
    role: "Frontend + Backend",
    img: "/src/assets/rakibul.jpg", // Change to actual image path
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-6xl">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden p-6 text-center">
            <img
              src={member.img}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{member.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
