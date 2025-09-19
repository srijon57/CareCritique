import { useState, useMemo } from "react";

const teamMembers = [
  {
    id: "20210204116",
    name: "Sumaiya Islam Daina",
    email: "daina116@gmail.com",
    username: "sumaiyadaina",
    role: "Database Expert",
    tags: [ "UI/UX", "Design"],
    img: "/src/assets/daina.jpg",
  },
  {
    id: "20220104120",
    name: "Zawad Al Mahi",
    email: "zawadalmahi@gmail.com",
    username: "zawadalmahi",
    role: "Frontend + Backend",
    tags: ["React", "Node.js"],
    img: "/src/assets/mahi.jpg",
  },
  {
    id: "20220104123",
    name: "Abdullah Al Jubayer",
    email: "abdullahaljubair2019@gmail.com",
    username: "abduillahaljubair",
    role: "Frontend + Backend",
    tags: ["JavaScript", "Express", "MongoDB"],
    img: "/src/assets/jubair.jpg",
  },
  {
    id: "20220104124",
    name: "KM Hasibur Rahman Srijon",
    email: "srijond57@gmail.com",
    username: "srijon57",
    role: "Lead + UI/UX",
    tags: ["Leadership", "API","Database", "SQL", "Optimization",],
    img: "/src/assets/srijon.jpg",
  },
  {
    id: "20210204077",
    name: "Rakibul Islam Rahi",
    email: "rakibulislam.rahi.rir@gmail.com",
    username: "Rakibul-rahi",
    role: "Frontend + Backend",
    tags: ["Fullstack", "React", "Firebase"],
    img: "/src/assets/rakibul.jpg",
  },
];

const AboutUs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  const allTags = useMemo(() => {
    const tags = new Set();
    teamMembers.forEach(member => {
      member.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const handleTagClick = (tag) => {
    setActiveTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag) 
        : [...prevTags, tag]
    );
  };

  const filteredMembers = useMemo(() => {
    let filteredList = teamMembers;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredList = filteredList.filter(member =>
        member.name.toLowerCase().includes(lowerCaseQuery) ||
        member.role.toLowerCase().includes(lowerCaseQuery) ||
        member.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    if (activeTags.length > 0) {
      filteredList = filteredList.filter(member =>
        activeTags.every(tag => member.tags.includes(tag))
      );
    }
    
    return [...filteredList].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
      if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchQuery, activeTags, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        About Us
      </h1>
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex flex-wrap gap-2 justify-center">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                activeTags.includes(tag) 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-teal-200 text-teal-900 hover:bg-teal-300 dark:bg-teal-700 dark:text-teal-100 dark:hover:bg-teal-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <button
          onClick={toggleSortDirection}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Sort {sortDirection === "asc" ? "Z-A" : "A-Z"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="max-w-sm mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-blue-400 transition-shadow duration-300"
          >
            <div className="relative">
              <img
  className="w-full aspect-[4/3] object-contain bg-gray-200 dark:bg-gray-700"
  src={member.img}
  alt={member.name}
/>
            </div>
            <div className="px-6 py-4">
              <div className="text-xl font-semibold text-gray-800 dark:text-white">
                {member.name}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2">
              {member.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-sm font-semibold text-teal-900 bg-teal-200 rounded-full dark:text-teal-100 dark:bg-teal-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mail- {member.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User- @{member.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID- {member.id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;