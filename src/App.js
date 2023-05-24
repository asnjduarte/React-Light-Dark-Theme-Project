import "./App.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Switch from "./Switch";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";


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
