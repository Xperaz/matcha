import React from "react";
import { Button } from "../ui/button";

const isAuth = false; // TODO: replace with actual auth check

const Hero = () => {
  return (
    <div>
      <h1>Swipe Right&#174;</h1>
      <Button className="primary-gradient primary-gradient:hover">
        {isAuth ? "Signout" : "Create Account"}
      </Button>
    </div>
  );
};

export default Hero;
