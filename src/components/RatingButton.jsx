// this was taken directly from the old BBB I did with Alex in Phase 4

import React, { useState } from "react";

export default function RatingButton( {rating, setRating} ) {
    const [hover, setHover] = useState(0);
    return (
        <div id='all-rating-buttons'>
            {[...Array(10)].map((toilet, index) => {
                index += 1
                return (
                    <button
                        id="toilet-button"
                        type="button"
                        key={index}
                        className={index <= (rating || hover) ? "hover-on" : "hover-off"}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <span>🚽</span>
                    </button>
                )
            })}
        </div>
    )
}