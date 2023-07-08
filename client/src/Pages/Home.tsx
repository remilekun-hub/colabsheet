import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const fields = [
    {
      id: 1,
      field: "Inbranded",
      data: [],
    },
    {
      id: 2,
      field: "Opendashboard",
      data: [],
    },
    {
      id: 3,
      field: "Apple Inc",
      data: [],
    },
  ];
  return (
    <div>
      <div className="flex justify-center items-center  gap-6 pt-10">
        {fields.map((f) => (
          <div
            key={f.id}
            className="bg-gray-300 rounded-[6px] p-3 cursor-pointer"
            onClick={() => navigate(`/spreadsheet/${f.field}/${f.id}`)}
          >
            {f.field}
          </div>
        ))}
      </div>
      hom here
    </div>
  );
}

export default Home;
