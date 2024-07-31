import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import "../css/App.css";

const CustomerHome = () => {
  
  const { token } = useContext(UserContext);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <p>
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life! I do wonder what can have happened to me! When
        I used to read fairy-tales, I fancied that kind of thing never happened,
        and now here I am in the middle of one! There ought to be a book written
        about me, that there ought! And when I grow up, I'll write one — but I'm
        grown up now,' she added in a sorrowful tone; 'at least there's no room
        to grow any more here.'
      </p>
    </div>
  );
};

export default CustomerHome;
