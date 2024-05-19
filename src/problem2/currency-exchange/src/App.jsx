import "./App.css";
import { Select, Button, ConfigProvider } from "antd";
import { RetweetOutlined } from "@ant-design/icons";
import { TinyColor } from "@ctrl/tinycolor";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

function App() {
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState([]);
  const [sendPriceInfo, setSendPriceInfo] = useState({
    currency: "",
    amount: ""
  });
  const [receivePriceInfo, setReceivePriceInfo] = useState({
    currency: "",
    amount: ""
  });
  const [exchangeRate, setExchangeRate] = useState("");

  const colors3 = ["#2b5876"];
  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  async function getData() {
    const response = await fetch("https://interview.switcheo.com/prices.json");
    const data = await response.json();
    setPriceInfo(data);
  }

  useEffect(() => {
    getData();
  }, []);

  function handleSubmit() {
    if (
      !/^\d*\.?\d*$/.test(receivePriceInfo.amount) ||
      !/^\d*\.?\d*$/.test(sendPriceInfo.amount)
    ) {
      toast.warning("Amount must be a number");
    } else if (
      receivePriceInfo.currency === "" ||
      sendPriceInfo.currency === ""
    ) {
      toast.warning("Please provide a currency");
    } else {
      setIsLoading(true);
      setTimeout(function () {
        const send = priceInfo.find(
          (r) => r.currency === sendPriceInfo.currency
        );
        const receive = priceInfo.find(
          (r) => r.currency === receivePriceInfo.currency
        );
        setExchangeRate(
          `1 ${send.currency} = ${(receive.price / send.price).toFixed(3)} ${
            receive.currency
          }`
        );
        if (receivePriceInfo.amount !== "") {
          setSendPriceInfo((prev) => ({
            ...prev,
            amount: (
              (Number(receivePriceInfo.amount) * send.price) /
              receive.price
            ).toFixed(3)
          }));
        } else if (sendPriceInfo.amount !== "") {
          setReceivePriceInfo((prev) => ({
            ...prev,
            amount: (
              (Number(sendPriceInfo.amount) * receive.price) /
              send.price
            ).toFixed(3)
          }));
        }
        console.log(sendPriceInfo, receivePriceInfo);
        setIsLoading(false);
      }, 2000);
    }
  }

  function handleChange(e) {
    if (e.target.name === "send") {
      setSendPriceInfo((prev) => ({
        ...prev,
        amount: e.target.value
      }));
      setReceivePriceInfo((prev) => ({
        ...prev,
        amount: ""
      }));
    } else {
      setReceivePriceInfo((prev) => ({
        ...prev,
        amount: e.target.value
      }));
      setSendPriceInfo((prev) => ({
        ...prev,
        amount: ""
      }));
    }
    console.log(sendPriceInfo, receivePriceInfo);
  }
  return (
    <div className="App">
      <Toaster position="top-right" />
      <p className="banner">CURRENCY CONVERTER</p>
      <div className="wrapper">
        <div className="converter">
          <div className="item">
            <label>Amount to send</label>
            <div className="input">
              <input
                name="send"
                type="text"
                onChange={handleChange}
                onBlur={(e) => {
                  console.log(e.target.value);
                  setSendPriceInfo((prev) => ({
                    ...prev,
                    amount: e.target.value
                  }));
                }}
                value={sendPriceInfo.amount}
              />
              <Select
                onChange={(value) => {
                  setSendPriceInfo((prev) => ({ ...prev, currency: value }));
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.value.toLowerCase().includes(input.toLowerCase())
                }
              >
                {priceInfo?.map((item, i) => {
                  return (
                    <Option value={item.currency} key={i}>
                      <img
                        src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`}
                        alt={item.currency}
                        width={30}
                        height={30}
                      />
                      <div>{item.currency}</div>
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="item">
            <label>Amount to receive</label>
            <div className="input">
              <input
                name="receive"
                type="text"
                onChange={handleChange}
                onBlur={(e) => {
                  setReceivePriceInfo((prev) => ({
                    ...prev,
                    amount: e.target.value
                  }));
                }}
                value={receivePriceInfo.amount}
              />
              <Select
                onChange={(value) => {
                  setReceivePriceInfo((prev) => ({ ...prev, currency: value }));
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.value.toLowerCase().includes(input.toLowerCase())
                }
              >
                {priceInfo?.map((item, i) => {
                  return (
                    <Option value={item.currency} key={i}>
                      <img
                        src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`}
                        alt={item.currency}
                        width={30}
                        height={30}
                      />
                      <div>{item.currency}</div>
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
        <div className="utils">
          <div className="info">{exchangeRate}</div>
          <div className="buttons">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `${colors3}`,
                    colorPrimaryHover: `${getHoverColors(colors3)}`,
                    colorPrimaryActive: `${getActiveColors(colors3)}`,
                    lineWidth: 0,
                    fontWeight: 500,
                    fontSize: 24,
                    paddingBlock: 25,
                    paddingInline: 40
                  }
                }
              }}
            >
              <Button
                type="primary"
                loading={isLoading}
                icon={<RetweetOutlined />}
                onClick={handleSubmit}
              >
                Convert
              </Button>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
