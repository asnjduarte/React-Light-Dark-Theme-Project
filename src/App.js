import "./App.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Switch from "./Switch";
import { useState, useEffect, useRef } from "react";
import { RadioGroup, RadioOption } from "./Radio";
import FeedbackForm from "./Feedback/FeebackForm";



/*Render props*/
const DataFetcher = ({render,url}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if(url.includes("desserts")) {
      setData(["cake", "ice cream", "pie", "brownie"]);
    } else {
      setData(["water", "soda", "juice"]);
    }
  }, []);

  return render(data);
};

const DessertsCount = () => {
  return (
    <DataFetcher
      url="https://littlelemon/desserts"
      render={(data) => <p>{data.length} desserts</p>}
      />
  );
};

const DrinksCount = () => {
  return (
    <DataFetcher
    url="https://littlelemon/drinks"
    render={(data) => <h3>{data.length} drinks</h3>}
    />
  );
};
/*End Render props*/


/*create HOC for cursor position*/
const withMousePosition  = (WrappedComponent) => {
  return (props) => {
    const [mousePosition, setMousePosition] = useState ({
      x:0,
      y:0,
    });

    useEffect(() => {
      const handleMousePositionChange = (e) => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      };

      window.addEventListener("mousemove", handleMousePositionChange);

      return () => {
        window.removeEventListener("mousemove", handleMousePositionChange);
      }
    },[]);

    return<WrappedComponent {...props} mousePosition={mousePosition}/>;
  };
};

const PointMouseLogger = ({ mousePosition }) => {
  if(!mousePosition) {
    return null;
  }
  return (
    <p>
      ({mousePosition.x}, {mousePosition.y})
    </p>
  )
}

const PanelMouseLogger = ({mousePosition}) => {
  if(!mousePosition) {
    return null;
  }
  return (
    <div className="BasicTracker">
      <p>Mouse position:</p>
      <div className="Row">
        <span>x: {mousePosition.x}</span>
        <span>y: {mousePosition.y}</span>
      </div>
    </div>
  )
}

const PanelMouseTracker = withMousePosition(PanelMouseLogger);
const PointMouseTracker = withMousePosition(PointMouseLogger);
/*create HOC for cursor position*/

const Title = ({ children }) => {
  const { theme } = useTheme();
  return (
    <h2
      style={{
        color: theme === "light" ? "black" : "white",
      }}
    >
      {children}
    </h2>
  );
};

const Paragraph = ({ children }) => {
  const { theme } = useTheme();
  return (
    <p
      style={{
        color: theme === "light" ? "black" : "white",
      }}
    >
      {children}
    </p>
  );
};

const Content = () => {
  return (
    <div>
      <Paragraph>
        We are a pizza loving family. And for years, I searched and searched and
        searched for the perfect pizza dough recipe. I tried dozens, or more.
        And while some were good, none of them were that recipe that would
        make me stop trying all of the others.
      </Paragraph>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <Title>Little Lemon 🍕</Title>
      <Switch />
    </header>
  );
};

const Page = () => {
  return (
    <div className="Page">
      <Title>When it comes to dough</Title>
      <Content />
    </div>
  );
};

function App() {
  const Button = ({ children, ...rest }) => (
    <button onClick={() => console.log("ButtonClick")} {...rest}>
      {children}
    </button>
  );
  
  const withClick = (Component) => {
    const handleClick = () => {
      console.log("WithClick");
    };
  
    return (props) => {
      return <Component onClick={handleClick} {...props} />;
    };
  };
  
  const MyButton = withClick(Button);
  /*writing the first test for your form*/
  const handleSubmit = () => {
    console.log("Form submitted");
  };
  /*writing the first test for your form*/
  /*Build a radio button exercse*/
  const [selected, setSelected] = useState("");
  const RadioButtonQuestion = () => {
    return (
      <div className="App">
        <h2>How did you hear about Little Lemon?</h2>
        <RadioGroup onChange={setSelected} selected={selected}>
          <RadioOption value="social_media">Social Media</RadioOption>
          <RadioOption value="friends">Friends</RadioOption>
          <RadioOption value="advertising">Advertising</RadioOption>
          <RadioOption value="other">Other</RadioOption>
        </RadioGroup>
        <button disabled={!selected}>Submit</button>
      </div>
    )
  }

  /*End build a radio button exercse*/
  /*Create custom hook exercise*/
  
  const [day, setDay] = useState("Monday");
  const prevDay = usePrevious(day);
  const getNextDay = () => {
    if (day === "Monday") {
      setDay("Tuesday")
    } else if (day === "Tuesday") {
      setDay("Wednesday")
    } else if (day === "Wednesday") {
      setDay("Thursday")
    } else if (day === "Thursday") {
      setDay("Friday")
    } else if (day === "Friday") {
      setDay("Monday")
    }
  }
  const NextDay = () => {
    return (
      <div style={{padding: "40px"}}>
        <h1>
          Today is: {day}<br />
          {
            prevDay && (
              <span>Previous work day was: {prevDay}</span>
            )
          }
        </h1>
        <button onClick={getNextDay}>
          Get next day
        </button>
      </div>
    );
  }
  function usePrevious(val) {
    const ref = useRef(null);
    useEffect(() => { ref.current = val }, [val]);
    return ref.current;
  }
  /*Create custom hook exercise end*/


  /*Fetching data*/
  const [user, setUser] = useState([]);
  const fetchData = () => {
    fetch("https://randomuser.me/api/?results=1")
    .then((response) => response.json())
    .then(data => setUser(data));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const FetchedData = () => {
    return Object.keys(user).length > 0 ? (
      <div style={{padding: "40px"}}>
        <h1>Customer data</h1>
        <h2>Name: {user.results[0].name.first}</h2>
        <img src={user.results[0].picture.large} alt=""/>
      </div>
    ) : (
      <h1>Data pending...</h1>
  
    );
  }

  /*Fetching data end*/

  /*Managing useState exercise*/
  const [giftCard, setGiftCard] = useState({
    firstName: "Jennifer",
    lastName: "Smith",
    text: "Free dinner for 4 guests",
    valid: true,
    instructions: "To use your coupon, click the button below.",
  });

  function spendGiftCard() {
    setGiftCard(prevState => {
      return {
        ...prevState,
        text: "Your coupon has been used.",
        valid: false,
        instructions: "Please visit our restaurant to renew your gift card.",
      }
    })
  }

  const GiftCard = () => {
    return (
      <div>
        <h1>Gift Card Page</h1>
        <h2>Customer: {giftCard.firstName} {giftCard.lastName}</h2>
        <h3>{giftCard.text}</h3>
        <p>{giftCard.instructions}</p>
        {
          giftCard.valid && (
            <button onClick={spendGiftCard}>
              Spend Gift Card
            </button>
          )
        }
      </div>
    );
  }
  /*Managing useState exercise*/
  
  const { theme } = useTheme();
  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === "light" ? "white" : "black",
      }}
    >
      <Header />
      <Page />
      <GiftCard/>
      <FetchedData/>
      <NextDay/>
      <RadioButtonQuestion/>
      <PanelMouseTracker/>
      <PointMouseTracker/>
      <DessertsCount />
      <DrinksCount />
      <FeedbackForm onSubmit={handleSubmit}/>
      <MyButton onClick={() => console.log("AppClick")}>Submit</MyButton>
    </div>
  );
}

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default Root;
