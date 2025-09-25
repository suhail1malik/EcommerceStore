// src/pages/Admin/UserList.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSearch,
  FaCopy,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

/**
 * Responsive UserList (improved)
 * - Desktop: table (md+)
 * - Mobile: compact collapsible cards (block md:hidden)
 * - Title attributes show full ID/email on hover (desktop)
 * - Copy ID button on mobile
 */

const UserList = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [query, setQuery] = useState("");
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [rowLoading, setRowLoading] = useState({}); // { [id]: { deleting, updating } }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u._id || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setRowBusy = (id, state) =>
    setRowLoading((prev) => ({ ...prev, [id]: { ...prev[id], ...state } }));

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setRowBusy(id, { deleting: true });
      await deleteUser(id).unwrap();
      toast.success("User deleted");
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Delete failed");
    } finally {
      setRowBusy(id, { deleting: false });
    }
  };

  const startEdit = (user) => {
    setEditableUserId(user._id);
    setEditableUserName(user.username || "");
    setEditableUserEmail(user.email || "");
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableUserName("");
    setEditableUserEmail("");
  };

  const updateHandler = async (id) => {
    if (!editableUserName.trim() || !editableUserEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    try {
      setRowBusy(id, { updating: true });
      await updateUser({
        userId: id,
        username: editableUserName.trim(),
        email: editableUserEmail.trim(),
      }).unwrap();
      toast.success("User updated");
      cancelEdit();
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Update failed");
    } finally {
      setRowBusy(id, { updating: false });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied ID to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {/* header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-semibold text-slate-100">Users</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage application users
            </p>
          </div>

          <div className="w-full md:w-1/3">
            <label className="relative block">
              <span className="sr-only">Search users</span>
              {/* <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" /> */}
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email or id..."
                aria-label="Search users"
                className="w-full pl-10 pr-10 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-1"
                >
                  {/* <FaTimes className="w-3.5 h-3.5" /> */}
                </button>
              )}
            </label>
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-hidden md:overflow-visible">
          {/* TABLE FOR md+ */}
          <div className="hidden md:block overflow-x-auto">
            {isLoading ? (
              <div className="p-6">
                <Loader />
              </div>
            ) : error ? (
              <div className="p-6">
                <Message variant="danger">
                  {error?.data?.message ||
                    error?.error ||
                    "Failed to load users"}
                </Message>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-900/40 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-transparent divide-y divide-slate-700">
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                  {filtered.map((user, idx) => {
                    const busy = rowLoading[user._id] || {};
                    const rowBg = idx % 2 === 0 ? "bg-slate-800/20" : "";
                    return (
                      <tr
                        key={user._id}
                        className={`${rowBg} hover:bg-slate-900/30`}
                      >
                        {/* ID with title (full ID on hover) */}
                        <td
                          className="px-6 py-4 max-w-[220px] text-sm text-slate-300 break-words"
                          title={user._id}
                        >
                          <span className="truncate block max-w-[220px]">
                            {user._id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editableUserName}
                                onChange={(e) =>
                                  setEditableUserName(e.target.value)
                                }
                                className="px-3 py-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 w-56"
                                aria-label={`Edit name for ${user.username}`}
                              />
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-slate-100">
                              {user.username || "—"}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {editableUserId === user._id ? (
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                              className="px-3 py-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 w-64"
                              aria-label={`Edit email for ${user.email}`}
                            />
                          ) : (
                            <div
                              className="text-sm text-slate-200 break-words max-w-[320px]"
                              title={user.email}
                            >
                              <span className="truncate block max-w-[320px]">
                                {user.email}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-700/20 text-emerald-300 text-xs">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-700/40 text-slate-300 text-xs">
                              User
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {editableUserId === user._id ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => updateHandler(user._id)}
                                disabled={busy.updating}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-60"
                                aria-label={`Save changes for ${user.username}`}
                              >
                                {busy.updating ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <FaCheck /> Save
                                  </>
                                )}
                              </button>

                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm"
                              >
                                <FaTimes /> Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => startEdit(user)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm"
                                aria-label={`Edit ${user.username}`}
                              >
                                <FaEdit /> Edit
                              </button>

                              <button
                                onClick={() => deleteHandler(user._id)}
                                disabled={busy.deleting}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-60"
                                aria-label={`Delete ${user.username}`}
                              >
                                {busy.deleting ? (
                                  "Deleting..."
                                ) : (
                                  <>
                                    <FaTrash /> Delete
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* MOBILE: collapsible cards (visible on small screens only) */}
          <div className="block md:hidden p-4 space-y-4">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error?.error || "Failed to load users"}
              </Message>
            ) : filtered.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No users found.
              </div>
            ) : (
              filtered.map((user) => {
                const busy = rowLoading[user._id] || {};
                const isEditing = editableUserId === user._id;
                return (
                  <details
                    key={user._id}
                    className="group bg-slate-900 border border-slate-700 rounded-lg"
                  >
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center text-white font-semibold">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-100 truncate">
                            {user.username || "—"}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-slate-700/40 text-slate-300">
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                    </summary>

                    <div className="px-4 pb-4">
                      <div className="mt-2 text-xs text-slate-400">
                        <strong className="text-slate-300">ID:</strong>{" "}
                        <span className="block break-words">{user._id}</span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100"
                              aria-label={`Edit name for ${user.username}`}
                            />
                            <input
                              type="email"
                              value={editableUserEmail}
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100"
                              aria-label={`Edit email for ${user.email}`}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateHandler(user._id)}
                                disabled={busy.updating}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-60"
                              >
                                {busy.updating ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <FaCheck /> Save
                                  </>
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-700 text-slate-100"
                              >
                                <FaTimes /> Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => deleteHandler(user._id)}
                              disabled={busy.deleting}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white disabled:opacity-60"
                            >
                              {busy.deleting ? (
                                "Deleting..."
                              ) : (
                                <>
                                  <FaTrash /> Delete
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(user._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 text-slate-100"
                              title="Copy user id"
                            >
                              <FaCopy /> Copy ID
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })
            )}
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-slate-700 p-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {filtered.length} / {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
