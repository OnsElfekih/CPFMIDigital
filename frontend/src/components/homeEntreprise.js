import { useEffect } from "react";

const HomeEntreprise= () => {
  useEffect(() => {
    document.title = "HomeEntreprise";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-bold">Hello Entreprise</p>
    </div>
  );
};

export default HomeEntreprise;
