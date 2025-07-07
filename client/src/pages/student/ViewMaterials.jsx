import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function ViewMaterials() {
  const { sessionId, date } = useParams();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(sessionId + " " + date);
    if (sessionId && date) {
      axios
        .get(`http://localhost:5000/api/materials/${sessionId}`, {
          params: {
            date,
          },
          withCredentials: true,
        })
        .then((res) => {
          setMaterials(res.data.materials || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching materials:", err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <>
      <Navbar role={"student"} />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            📁 Session Materials
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">
              Loading materials...
            </p>
          ) : materials.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No materials found for this date.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="border border-gray-200 rounded-lg shadow-md p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {material.description || "No description provided."}
                  </p>
                  {/* FIX DOWNLOAD */}
                  <a
                    href={material.fileUrl}
                    download
                    className="text-indigo-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Uploaded on:{" "}
                    {new Date(material.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
