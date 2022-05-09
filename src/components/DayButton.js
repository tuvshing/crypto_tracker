
const DayButton = ({ children, selected, onClick }) => {
  return (
    <span onClick={onClick} 
    style={{    
      border: "1px white",
      borderRadius: 5,
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      fontFamily: "Open Sans",
      cursor: "pointer",
      backgroundColor: selected ? "#bd93f9" : "#282a36",
      color: selected ? "white" : "",
      fontWeight: selected ? 700 : 500,
      // "&:hover": {
      //   backgroundColor: "#bd93f9",
      //   color: "#bd93f9",
      // },
      width: "22%",
      //   margin: 5,
    }}
    >
      {children}
    </span>
  )
}

export default DayButton
