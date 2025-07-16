import { useEffect } from "react";

const HomeAdmin= () => {
  useEffect(() => {
    document.title = "HomeAdmin";
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-bold">Hello Admin</p>
    </div>
  );
};

export default HomeAdmin;
