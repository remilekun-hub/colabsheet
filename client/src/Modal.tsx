import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { MultiSelect } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type ModalProp = {
  setCreateModal: Dispatch<SetStateAction<boolean>>;
};

function Modal({ setCreateModal }: ModalProp) {
  const [dbname, setDbName] = useState<string>("");
  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log({ tableData });

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className="w-[95%] sm:w-[70%] md:w-[500px] lg:w-[600px] relative">
        <span
          className=" bg-white text-black rounded-[5px] cursor-pointer absolute -top-[45px] right-0 px-2 py-1"
          onClick={() => setCreateModal(false)}
        >
          Close
        </span>
        <div></div>
        <div className="flex flex-col bg-slate-200 p-2 rounded-[3px]">
          <label>
            Database:{" "}
            <input
              type="text"
              className="outline-0 mb-3 h-[35px] px-1"
              value={dbname}
              onChange={(e) => setDbName(e.target.value)}
            />
          </label>
          <div className="px-1 mt-2 mb-4">
            <MultiSelect
              label="Create Table Column"
              data={tableData}
              placeholder="Select items"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setTableData((current) => [...current, item]);
                return item;
              }}
            />
          </div>
          <div className="flex gap-2 ">
            <button
              className="border-2 bg-black text-white h-[40px] w-full"
              onClick={async () => {
                if (!dbname) return;
                if (!tableData) return;
                let column = [];

                setisLoading(true);
                for (let i = 0; i < tableData.length; i++) {
                  column.push(tableData[i].value);
                }

                const { data } = await axios
                  .post<{ _id: string; field: string; data: [] }>(
                    "http://localhost:5050/createsheet",
                    {
                      field: dbname,
                      data: {
                        column,
                        row: [],
                      },
                    }
                  )

                  .finally(() => {
                    setisLoading(false);
                    setDbName("");
                    setTableData([]);
                    setCreateModal(false);
                  });
                navigate(`/spreadsheet/${data.field}/${data._id}`);
                console.log({ data });
              }}
            >
              Create
            </button>
            <button
              className="border-1 bg-white text-black h-[40px] w-full border-black"
              onClick={() => {
                setDbName("");
                setCreateModal(false);
              }}
            >
              Cancel
            </button>
          </div>
          {isLoading && <p className="text-center my-2">Creating Table...</p>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
