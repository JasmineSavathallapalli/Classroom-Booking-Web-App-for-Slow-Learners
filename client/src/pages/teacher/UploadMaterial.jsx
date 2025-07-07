import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../components/NavBar";

export default function UploadMaterial() {
  const { id, date } = useParams();
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = id;

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const fetchMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/materials/${sessionId}`,
        {
          params: { date: date },
          withCredentials: true,
        }
      );
      setMaterials(response.data.materials);
    } catch (err) {
      setError("Failed to load materials. Please try again later.");
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for the file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("material", file);
    formData.append("date", date);
    formData.append("sessionId", sessionId);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:5000/api/materials/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setSuccess("File uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      document.getElementById("fileInput").value = "";

      fetchMaterials();
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <>
      <Navbar role={"teacher"} />
      <div className="bg-[url('/images/background1.png')] bg-cover bg-center min-h-screen py-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10 z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200 flex items-center gap-2">
              <i
                className="fas fa-upload text-blue-500"
                style={{ color: "black" }}
              ></i>{" "}
              Upload New Material
            </h2>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter file title"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter a brief description"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Select File
                </label>
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  uploading || !file
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md"
                }`}
              >
                {uploading ? (
                  <>
                    <i
                      className="fas fa-spinner fa-spin mr-2"
                      style={{ color: "black" }}
                    ></i>{" "}
                    Uploading...
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-cloud-upload-alt mr-2"
                      style={{ color: "black" }}
                    ></i>{" "}
                    Upload File
                  </>
                )}
              </button>
            </form>

            {error && (
              <p className="text-red-600 mt-4 animate-pulse">{error}</p>
            )}
            {success && (
              <p className="text-green-600 mt-4 animate-bounce">{success}</p>
            )}
          </div>

          {/* Material List Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200 flex items-center gap-2">
              <i
                className="fas fa-folder-open text-indigo-500"
                style={{ color: "black" }}
              ></i>{" "}
              Materials for{" "}
              <span className="text-blue-600">{formatDate(date)}</span>
            </h2>

            {loading ? (
              <p className="text-gray-500">
                <i
                  className="fas fa-spinner fa-spin mr-2"
                  style={{ color: "black" }}
                ></i>
                Loading materials...
              </p>
            ) : materials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
                  <thead className="bg-indigo-50 text-gray-700 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Uploaded At</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {materials.map((material) => (
                      <tr key={material._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {material.title || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(material.uploadedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={material.fileUrl}
                            className="text-indigo-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i
                              className="fas fa-download mr-1"
                              style={{ color: "black" }}
                            ></i>
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No materials found for this date.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
