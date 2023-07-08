import { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme

function Singlesheet() {
  const { docname, id } = useParams();
  const navigate = useNavigate();
  const [mySocket, setMySocket] = useState<Socket>();
  const [createColName, setCreateColName] = useState<string>("");
  const [sheetName, setSheetName] = useState("");
  const [isSheetModal, setisSheetModal] = useState(false);

  const [fields, setFields] = useState([
    {
      id: "1",
      field: "Inbranded",
      data: [],
    },
    {
      id: "2",
      field: "Opendashboard",
      data: [],
    },
    {
      id: "3",
      field: "Apple Inc",
      data: [],
    },
  ]);
  const data = [
    {
      id: "1",
      Date: "2022-01-02",
      CustomerName: "Wale Adenuga",
      ItemSold: "Product A",
      Quantity: "10",
      UnitPrice: "$50",
    },
    {
      id: "2",
      Date: "2022-01-03",
      CustomerName: "Jimmy cooks",
      ItemSold: "Product B",
      Quantity: "10",
      UnitPrice: "$80",
    },
  ];
  type rowInputData = {
    id: string;
    Date: string;
    CustomerName: string;
    ItemSold: string;
    Quantity: string;
    UnitPrice: string;
  };
  const [rowInput, setRowInput] = useState<rowInputData[]>(data);
  const [columnDef, setColumnDef] = useState<{}[]>([
    { field: "Date", editable: true, type: "leftAligned" },
    { field: "CustomerName", editable: true, type: "leftAligned" },
    { field: "ItemSold", editable: true, type: "leftAligned" },
    { field: "Quantity", editable: true, type: "rightAligned" },
    { field: "UnitPrice", editable: true, type: "rightAligned" },
  ]);

  const gridRef = useRef(null);
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  const handleDataChange = (value: any) => {
    const {
      data: { id: rowId },
    } = value;

    const newRowData = rowInput.filter((singleRow: any) =>
      singleRow.id === rowId ? (singleRow = value.data) : singleRow
    );

    mySocket?.emit("cell-data-change", newRowData);
  };

  // get data

  useEffect(() => {
    const socket = io("https://colabspreadsheet.onrender.com/");
    setMySocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [docname, id]);

  useEffect(() => {
    mySocket?.on("col-updated", (data) => {
      setColumnDef(data);
    });
    return () => {
      mySocket?.off("col-updated");
    };
  }, [mySocket]);

  useEffect(() => {
    mySocket?.on("row-updated", (data) => {
      setRowInput(data);
    });
    return () => {
      mySocket?.off("row-updated");
    };
  }, [mySocket]);

  useEffect(() => {
    mySocket?.on("cell-data-change", (data) => {
      setRowInput(data);
    });
    return () => {
      mySocket?.off("cell-data-change");
    };
  }, [mySocket]);

  return (
    <div>
      <div className="flex">
        <div className="w-[300px] pt-5 px-3 sticky top-5">
          <div className="mb-3 border-2 border-gray-200 rounded-[5px] focus:border-gray-300 h-[40px] flex items-center justify-center">
            <input
              type="text"
              className="border-0 w-full h-full outline-0 bg-gray-50 px-3"
              placeholder="search..."
            />
          </div>
          <div className="flex justify-between items-baseline ">
            <h1 className="font-medium">Databases</h1>{" "}
            <div
              className="text-[22px] font-bold cursor-pointer mr-3"
              onClick={() => setisSheetModal(true)}
            >
              +
            </div>
          </div>
          {isSheetModal && (
            <div className="flex flex-col">
              <input
                type="text"
                value={sheetName}
                placeholder="sheetName"
                className="w-full outline-none px-3 py-2 rounded-[7px] border-2 border-gray-300 my-3"
                onChange={(e) => setSheetName(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  className="cursor-pointer bg-gray-300 p-2 rounded-md w-full"
                  onClick={async () => {
                    if (!sheetName) return;
                    setFields([
                      ...fields,
                      { id: uuidV4(), field: sheetName, data: [] },
                    ]);
                    navigate(`/spreadsheet/${sheetName}/${uuidV4()}`);
                    setSheetName("");
                  }}
                >
                  Create Sheet
                </button>
                <button
                  className="cursor-pointer bg-gray-300 p-2 rounded-md w-full"
                  onClick={() => {
                    setSheetName("");
                    setisSheetModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            {!fields && "fetching..."}
            {fields?.map((f) => (
              <div
                key={f.id}
                onClick={() => navigate(`/spreadsheet/${f.field}/${f.id}`)}
                className={`cursor-pointer hover:bg-gray-100 font-semibold flex items-center gap-2 rounded-[5px] pl-4 py-3 ${
                  f.field === docname ? "bg-gray-100" : "bg-white text-gray-400"
                }`}
              >
                <span className={f.field === docname ? "visible" : "invisible"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                {f.field}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 pt-5">
          {fields && docname && id && (
            <div>
              <div
                className="ag-theme-alpine"
                style={{ width: "94%", height: `85vh` }}
              >
                <AgGridReact
                  rowData={rowInput}
                  ref={gridRef}
                  columnDefs={columnDef}
                  defaultColDef={defaultColDef}
                  onCellValueChanged={handleDataChange}
                />
              </div>{" "}
              <div className="flex gap-10 items-center mt-3">
                <span
                  className="cursor-pointer bg-gray-300 p-2 rounded-md"
                  onClick={() => {
                    const newRow = {
                      id: uuidV4(),
                      Date: "",
                      CustomerName: "",
                      ItemSold: "",
                      Quantity: "",
                      UnitPrice: "",
                    };
                    const updatedRow = [...rowInput, newRow];
                    setRowInput([...updatedRow]);
                    mySocket?.emit("add-row", updatedRow, id);
                  }}
                >
                  Add row
                </span>
                <div>
                  <input
                    type="text"
                    className="outline-0 border-2 border-grey-300 mr-2 p-1"
                    placeholder="Column Name"
                    value={createColName}
                    onChange={(e) => setCreateColName(e.target.value)}
                  />
                  <span
                    className="cursor-pointer bg-gray-300 p-2 rounded-md"
                    onClick={() => {
                      if (!createColName) return;
                      const prevCol = columnDef;

                      const newCol = {
                        field: createColName,
                        editable: true,
                        type: "rightAligned",
                      };
                      setColumnDef([...prevCol, newCol]);
                      const updatedCol: {}[] = [...prevCol, newCol];
                      setCreateColName("");
                      mySocket?.emit("add-col", updatedCol);
                    }}
                  >
                    Add Column
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Singlesheet;
