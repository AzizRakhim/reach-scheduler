import { DayPilotScheduler, DayPilot } from "daypilot-pro-react";
import { useState, useMemo, useRef, useEffect } from "react";
import "./App.css";
import Zoom from "./Zoom";

function App() {
  const [state, setState] = useState({
    startDate: "2023-03-01",
    days: 31,
    scale: "Day",
    eventHeight: 30,
    cellWidth: 50,
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    cellWidthSpec: "Auto",
    resources: [
      { name: "Resource A", id: "A" },
      { name: "Resource B", id: "B" },
      { name: "Resource C", id: "C" },
      { name: "Resource D", id: "D" },
      { name: "Resource E", id: "E" },
      { name: "Resource F", id: "F" },
      { name: "Resource G", id: "G" },
    ],
    events: [
      {
        id: 1,
        text: "Event 1",
        start: "2023-03-02T00:00:00",
        end: "2023-03-05T00:00:00",
        resource: "A",
      },
      {
        id: 2,
        text: "Event 2",
        start: "2023-03-03T00:00:00",
        end: "2023-03-10T00:00:00",
        resource: "C",
        barColor: "#38761d",
        barBackColor: "#93c47d",
      },
      {
        id: 3,
        text: "Event 3",
        start: "2023-03-02T00:00:00",
        end: "2023-03-08T00:00:00",
        resource: "D",
        barColor: "#f1c232",
        barBackColor: "#f1c232",
      },
      {
        id: 4,
        text: "Event 4",
        start: "2023-03-02T00:00:00",
        end: "2023-03-08T00:00:00",
        resource: "E",
        barColor: "#cc0000",
        barBackColor: "#ea9999",
      },
    ],
    durationBarVisible: false,
  });
  const [zoom, setZoom] = useState({
    level: "month",
  });

  const schedulerRef = useRef(null);

  const config = useMemo(() => {
    const { ...tempConfig } = state;

    return { ...tempConfig };
  }, [state]);

  const change = (ev) => {
    const newLevel = ev.target.value;

    setZoom({
      level: newLevel,
    });

    switch (newLevel) {
      case "month":
        setState({
          ...state,
          startDate: DayPilot.Date.today().firstDayOfMonth(),
          days: DayPilot.Date.today().daysInMonth(),
          scale: "Day",
        });
        break;
      case "week":
        setState({
          ...state,
          startDate: DayPilot.Date.today().firstDayOfWeek(),
          days: 7,
          scale: "Day",
        });
        break;
      default:
        throw new Error("Invalid zoom level");
    }
  };

  useEffect(() => {
    if (schedulerRef.current) {
      schedulerRef.current.control.onTimeRangeSelected =
        handleTimeRangeSelected;
      schedulerRef.current.control.onEventResized = handleEventResized;
    }
  }, [schedulerRef]);

  function handleTimeRangeSelected(args) {
    DayPilot.Modal.prompt("New event name", "Event").then((modal) => {
      schedulerRef.current.control.clearSelection();
      if (!modal.result) {
        return;
      }
      schedulerRef.current.control.events.add({
        id: DayPilot.guid(),
        text: modal.result,
        start: args.start,
        end: args.end,
        resource: args.resource,
      });
    });
  }

  function handleEventResized(args) {
    console.log("Event resized: ", args.e.data.id, args.newStart, args.newEnd);
    schedulerRef.current.control.message("Event resized: " + args.e.data.text);
  }

  function handleBeforeEventRender(args) {
    if (!args.data.backColor) {
      args.data.backColor = "#93c47d";
    }
    args.data.borderColor = "darker";
    args.data.fontColor = "white";
  }

  return (
    <div>
      <div className="toolbar">
        <Zoom state={zoom} change={change} />
      </div>
      <DayPilotScheduler
        {...config}
        onEventMoved={(args) => {
          console.log(
            "Event moved: ",
            args.e.data.id,
            args.newStart,
            args.newEnd,
            args.newResource
          );
        }}
        ref={schedulerRef}
        onBeforeEventRender={handleBeforeEventRender}
      />
    </div>
  );
}

export default App;
