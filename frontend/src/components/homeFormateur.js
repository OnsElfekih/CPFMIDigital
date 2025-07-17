import { useEffect } from "react";

const HomeFormateur= () => {
  useEffect(() => {
    document.title = "HomeFormateur";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-bold">Hello Formateur</p>
    </div>
  );
};

export default HomeFormateur;
