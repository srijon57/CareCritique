import { useEffect, useState } from 'react';
import axios from 'axios';

const NewsApp = () => {
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://newsdata.io/api/1/news?apikey=pub_51041d0f08f92ea6f6100537235a8c697d21e&country=bd&category=health'
        );
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">News Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          {newsData ? (
            newsData.results.map((article) => (
              <div
                key={article.article_id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl"
              >
                {article.image_url && (
                  <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="rounded-lg w-32 h-32 object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-cyan-800 dark:text-white">{article.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{article.description}</p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsApp;
