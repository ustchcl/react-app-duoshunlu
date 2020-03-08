import React from "react"

export const MenuItem = (icon: string, title: string) => {
  return (
    <div 
      style={{border: "0px", background:"rgba(255,255,255,1)", borderRadius: "15px", width:"40%", height: "40vw"}}
    >
      <img src={icon} className="am-grid-icon"></img>
      <div className="am-grid-text">{title}</div>
    </div>
  )
}