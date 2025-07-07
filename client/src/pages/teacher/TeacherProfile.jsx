import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  PlusCircle,
  Book,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import Navbar from "../../components/NavBar";

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    id: null,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@education.org",
    mobile: "(555) 123-4567",
    avatar: "/api/placeholder/400/400",
    subjects: [],
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
    mobile: false,
    subjects: false,
  });

  const [newSubject, setNewSubject] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        const user = response.data.user;
        setProfile({
          id: user._id,
          name: user.name,
          email: user.email,
          subjects: user.subjectsTeaching || [],
        });
      })
      .catch(() => console.log("User not authenticated"));
  }, []);

  const handleChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const toggleEdit = (field) => {
    setEditing({
      ...editing,
      [field]: !editing[field],
    });
  };

  const handleSubjectChange = (field, value) => {
    if (field === "subjectCode") setNewSubjectCode(value);
    else setNewSubject(value);
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      const sub = newSubjectCode.trim() + " - " + newSubject.trim();
      axios
        .put(
          `http://localhost:5000/api/users/teacher/${profile.id}/add-subject`,
          { subject: sub },
          { withCredentials: true }
        )
        .then((response) => {
          console.log("Subject added");
        })
        .catch((error) => console.log(error));
      setProfile({
        ...profile,
        subjects: [...profile.subjects, sub],
      });
      setNewSubject("");
      setNewSubjectCode("");
    }
  };

  const removeSubject = (index) => {
    const updatedSubjects = [...profile.subjects];
    updatedSubjects.splice(index, 1);
    setProfile({
      ...profile,
      subjects: updatedSubjects,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbar role={"teacher"} />
      {/* Header bar that sticks when scrolled */}
      <div
        className={`sticky top-0 z-20 backdrop-blur-lg transition-all duration-300 bg-white/90 shadow-md py-2`}
      >
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Profile header with avatar */}
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-800">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute right-0 bottom-0 p-4"></div>
              </div>

              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-6">
                  <div className="p-1 bg-white rounded-full shadow-lg">
                    <img
                      className="w-32 h-32 rounded-full object-cover border-4 border-white"
                      src="/images/avatar.png"
                      alt="Avatar"
                    />
                  </div>
                </div>

                <div className="pt-20">
                  {/* Name */}
                  <div className="flex items-center mb-1">
                    {editing.name ? (
                      <div className="flex w-full">
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-800 text-xl font-bold flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                          onClick={() => toggleEdit("name")}
                          className="ml-2 text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Save size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-gray-800 text-2xl font-bold">
                          {profile.name}
                        </h2>
                        <button
                          onClick={() => toggleEdit("name")}
                          className="ml-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Mail className="text-gray-500" size={20} />
                      </div>
                      {editing.email ? (
                        <div className="flex flex-grow ml-3">
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          <button
                            onClick={() => toggleEdit("email")}
                            className="ml-2 text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Save size={20} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-700 flex-grow ml-3">
                            {profile.email}
                          </span>
                          <button
                            onClick={() => toggleEdit("email")}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Phone className="text-gray-500" size={20} />
                      </div>
                      {editing.mobile ? (
                        <div className="flex flex-grow ml-3">
                          <input
                            type="tel"
                            value={profile.mobile}
                            onChange={(e) =>
                              handleChange("mobile", e.target.value)
                            }
                            className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          <button
                            onClick={() => toggleEdit("mobile")}
                            className="ml-2 text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Save size={20} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-700 flex-grow ml-3">
                            {profile.mobile}
                          </span>
                          <button
                            onClick={() => toggleEdit("mobile")}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Content tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Teaching Subjects
                </h2>
                <button
                  onClick={() => toggleEdit("subjects")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    editing.subjects
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {editing.subjects ? "Done Editing" : "Edit Subjects"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.subjects.length > 0 ? (
                  // Map through subjects if there are any
                  profile.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-bold text-gray-800">
                            {subject}
                          </h3>
                          {editing.subjects && (
                            <button
                              onClick={() => removeSubject(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show this message when there are no subjects
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Book size={48} className="text-gray-400 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No subjects to display
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add subjects that you are currently teaching
                    </p>
                    {!editing.subjects && (
                      <button
                        onClick={() => toggleEdit("subjects")}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Add Your First Subject
                      </button>
                    )}
                  </div>
                )}

                {/* Add new subject form - only shown when in edit mode */}
                {editing.subjects && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col justify-center hover:border-blue-300 transition-colors">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Add New Subject
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) =>
                            handleSubjectChange("name", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="e.g. Web Development"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Code
                        </label>
                        <input
                          type="text"
                          value={newSubjectCode}
                          onChange={(e) =>
                            handleSubjectChange("subjectCode", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="e.g. PMCA601P"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>{/* Empty div for grid alignment */}</div>
                      </div>
                      <button
                        onClick={addSubject}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <PlusCircle size={18} className="mr-1" />
                        Add Subject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
