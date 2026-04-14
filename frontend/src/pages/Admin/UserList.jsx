// src/pages/Admin/UserList.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaTimes, FaCheck, FaTrash, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../../redux/api/usersApiSlice";

const UserRow = ({ user, refetchUsers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const [editName, setEditName] = useState(user.username || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.isAdmin ? "admin" : "user");

  const saveChanges = async () => {
    try {
      await updateUser({
        userId: user._id,
        username: editName,
        email: editEmail,
        isAdmin: role === "admin"
      }).unwrap();
      toast.success("User updated successfully");
      if (refetchUsers) refetchUsers();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Update failed");
    }
  };

  const roleChangeHandler = async (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole !== (user.isAdmin ? "admin" : "user")) {
       try {
         await updateUser({
           userId: user._id,
           username: editName,
           email: editEmail,
           isAdmin: newRole === "admin"
         }).unwrap();
         toast.success(`Role changed to ${newRole}`);
         if (refetchUsers) refetchUsers();
       } catch (err) {
         toast.error(err?.data?.message || err?.error || "Update failed");
       }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success("User deleted");
      if (refetchUsers) refetchUsers();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Delete failed");
    }
  };

  return (
    <div className={`group bg-white dark:bg-slate-800 rounded-[20px] md:rounded-[24px] overflow-hidden border transition-all duration-500 ${
      isExpanded 
        ? "border-emerald-200 dark:border-emerald-500/30 shadow-xl ring-1 ring-emerald-100 dark:ring-emerald-500/20" 
        : "border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600"
    }`}>
      {/* Header Row */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 shrink-0 border border-gray-200 dark:border-slate-700">
            <span className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-500 uppercase">
              {user.username ? user.username.charAt(0) : "U"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                 Acc-{user._id.substring(0, 6)}
               </span>
               <div className={`w-1.5 h-1.5 rounded-full ${user.isAdmin ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-slate-100 line-clamp-1">
              {user.username || "—"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-900 dark:text-slate-200 max-w-[200px] truncate">{user.email}</p>
           </div>
           
           <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${
              user.isAdmin 
                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30" 
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-600"
           }`}>
              {user.isAdmin ? "Admin" : "User"}
           </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-6 md:px-8 md:pb-8 pt-2 border-t border-gray-100 dark:border-slate-700/50">
               <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                 
                 {/* Internal Profile Modifier */}
                 <div className="md:col-span-7 lg:col-span-8 bg-gray-50 dark:bg-slate-900/50 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-4">Account Profile Data</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Display Name</label>
                         <input 
                           type="text"
                           value={editName}
                           onChange={(e) => setEditName(e.target.value)}
                           className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-900 dark:text-slate-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                         />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Email Address</label>
                         <input 
                           type="email"
                           value={editEmail}
                           onChange={(e) => setEditEmail(e.target.value)}
                           className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-900 dark:text-slate-100 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                         />
                       </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                       <button
                         onClick={saveChanges}
                         disabled={isUpdating}
                         className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                       >
                         {isUpdating ? "Saving..." : <><FaCheck className="w-4 h-4" /> Save Profile</>}
                       </button>
                    </div>
                 </div>

                 {/* Internal Access Role Dropdown Modifier */}
                 <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-500/20 mb-4 flex-1">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4">Access Hierarchy</h4>
                       
                       <div className="relative group/drop">
                           <select 
                             className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-500/30 text-gray-900 dark:text-slate-100 font-bold text-sm px-5 py-3.5 rounded-xl outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/20 transition-all cursor-pointer disabled:opacity-50 inline-block"
                             value={role}
                             onChange={roleChangeHandler}
                             disabled={isUpdating}
                           >
                             <option value="user">Standard User</option>
                             <option value="admin">Administrator Privilege</option>
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within/drop:text-purple-600 pointer-events-none transition-colors">
                              <FaCheckCircle className="w-4 h-4" />
                           </div>
                        </div>
                        <p className="mt-3 text-xs text-purple-700 dark:text-purple-300 font-medium leading-relaxed">Changing the role will instantly grant or revoke admin dashboard access.</p>
                    </div>

                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      <FaTrash className="w-4 h-4" />
                      Revoke & Delete
                    </button>
                 </div>

               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserList = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery();
  const [query, setQuery] = useState("");

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Identity Register</h1>
           <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">Manage and escalate platform privileges.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search active identities..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 pr-10 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-[16px] text-sm font-medium focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all w-full text-gray-900 dark:text-slate-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
           {[1,2,3,4].map(n => (
             <div key={n} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[24px] p-6 h-[90px] animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl" />
                <div>
                  <div className="w-24 h-3 bg-gray-100 dark:bg-slate-700 rounded mb-2" />
                  <div className="w-32 h-4 bg-gray-100 dark:bg-slate-700 rounded" />
                </div>
             </div>
           ))}
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Failed to load users"}
        </Message>
      ) : (
        <div className="space-y-4">
          {filtered.map((user) => (
            <UserRow key={user._id} user={user} refetchUsers={refetch} />
          ))}
          {filtered.length === 0 && (
             <div className="py-20 text-center">
               <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
                 <FaSearch className="w-6 h-6" />
               </div>
               <p className="text-gray-400 dark:text-slate-500 font-medium">No identical identities found.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
