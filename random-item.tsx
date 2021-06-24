import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  IconButton,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  Delete,
  ExpandMore,
} from "@material-ui/icons";
import { sum } from "lodash";
import React, { useEffect, useState } from "react";
interface Item {
  possibility: number;
  name: string;
}
const total = 100;
function useStoredState<T>(key: string, dft: T) {
  const [item, setItems] = useState<T>(dft);
  const itemStore = localStorage.getItem(key);
  useEffect(() => {
    if (itemStore) {
      setItems(JSON.parse(itemStore));
    }
  }, [itemStore]);
  const setter = (items: T) => {
    setItems(items);
    localStorage.setItem(key, JSON.stringify(items));
  };
  return [item, setter] as const;
}
const itemStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
export const RandomItem: React.FC<{ settings: boolean }> = ({ settings }) => {
  const [items, setItems] = useStoredState<Item[]>("songs", []);
  const itemsExceptLast = items.slice(0, items.length - 1);
  const lastItem: Item | undefined = items[items.length - 1];
  const totalPosibility = sum(itemsExceptLast.map((item) => item.possibility));
  const lastPosibility = total - totalPosibility;
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pickedItem, setPickedItem] = useState<Item | undefined>();
  const [{ random, counter }, setRandomConfig] = useStoredState("random", {
    random: true,
    counter: 0,
  });
  const deleteItem = (item: Item) => {
    const index = items.findIndex((s) => s === item);
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  };
  const moveUp = (item: Item) => {
    const index = items.findIndex((s) => s === item);
    if (index <= 0) return;
    items[index] = items[index - 1];
    items[index - 1] = item;
    setItems([...items]);
  };
  const moveDown = (item: Item) => {
    const index = items.findIndex((s) => s === item);
    if (index === items.length - 1) return;
    items[index] = items[index + 1];
    items[index + 1] = item;
    setItems([...items]);
  };
  useEffect(() => {
    if (items.length) {
      setItems([
        ...itemsExceptLast,
        {
          name: lastItem!.name,
          possibility: lastPosibility,
        },
      ]);
    }
  }, [totalPosibility]);
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          随机列表
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            {itemsExceptLast.map((item, index) => (
              <div>
                <div key={index} style={itemStyle}>
                  <Typography style={{ width: "30%" }}>{item.name}</Typography>
                  <div
                    style={{
                      width: "30%",
                      display: "flex",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      <Delete></Delete>
                    </IconButton>
                    {settings && (
                      <>
                        <IconButton onClick={() => moveDown(item)}>
                          <ArrowDownwardOutlined></ArrowDownwardOutlined>
                        </IconButton>
                        <IconButton onClick={() => moveUp(item)}>
                          <ArrowUpwardOutlined></ArrowUpwardOutlined>
                        </IconButton>
                      </>
                    )}
                  </div>
                </div>
                <Slider
                  style={{
                    display: settings ? "inherit" : "none",
                  }}
                  max={lastPosibility + item.possibility}
                  value={item.possibility}
                  valueLabelDisplay="on"
                  onChangeCommitted={(_, value) => {
                    const index = items.findIndex((s) => s === item);
                    setItems([
                      ...items.slice(0, index),
                      { ...item, possibility: +value },
                      ...items.slice(index + 1),
                    ]);
                  }}
                ></Slider>
              </div>
            ))}
            {!!lastItem && (
              <div>
                <div style={itemStyle}>
                  <Typography style={{ width: settings ? undefined : "30%" }}>
                    {lastItem.name}
                  </Typography>

                  <div
                    style={{
                      width: "30%",
                      display: "flex",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        deleteItem(lastItem);
                      }}
                    >
                      <Delete></Delete>
                    </IconButton>
                    {settings && (
                      <>
                        <IconButton onClick={() => moveDown(lastItem)}>
                          <ArrowDownwardOutlined></ArrowDownwardOutlined>
                        </IconButton>
                        <IconButton onClick={() => moveUp(lastItem)}>
                          <ArrowUpwardOutlined></ArrowUpwardOutlined>
                        </IconButton>
                      </>
                    )}
                  </div>
                </div>
                <Slider
                  style={{
                    width: "100%",
                    display: settings ? "inherit" : "none",
                  }}
                  disabled
                  valueLabelDisplay="on"
                  max={Math.min(total, lastPosibility * 2)}
                  value={lastPosibility}
                  onChangeCommitted={(e) => {
                    console.log(e.target);
                  }}
                ></Slider>
              </div>
            )}
            <div style={{ display: settings ? "inherit" : "none" }}>
              <Button
                variant="contained"
                onClick={() => {
                  if (!items.length) return;
                  const avg = Math.floor(total / items.length);
                  setItems([
                    ...itemsExceptLast.map((item) => ({
                      ...item,
                      possibility: avg,
                    })),
                    {
                      ...lastItem,
                      possibility: total - avg * (items.length - 1),
                    },
                  ]);
                }}
              >
                平均化
              </Button>
              <label style={{marginLeft: "10px"}}>使用{random ? "随机" : "顺序"}</label>
              <Switch
                checked={random}
                onChange={() => {
                  setRandomConfig({ counter, random: !random });
                }}
              ></Switch>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="名称"
        ></TextField>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setItems([
              ...items,
              { name: text, possibility: items.length === 0 ? total : 0 },
            ]);
          }}
        >
          添加
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={async () => {
            setLoading(true);
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 1000);
            });
            setLoading(false);
            if (!random) {
              setRandomConfig({ counter: counter + 1, random });
              setPickedItem(items[(counter + 1) % items.length]);
              return;
            }
            let p = Math.random() * total;
            for (const item of items) {
              p -= item.possibility;
              if (p < 0) {
                setPickedItem(item);
                return;
              }
            }
          }}
        >
          抽取
        </Button>
      </div>
      <div>
        <h2>
          {loading ? (
            <CircularProgress />
          ) : (
            pickedItem && `你抽到了${pickedItem.name}`
          )}
        </h2>
      </div>
    </div>
  );
};
