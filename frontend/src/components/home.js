import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Home";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-bold">Hello</p>
    </div>
  );
};

export default Home;
