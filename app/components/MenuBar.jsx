// "use client";

// import { useState } from "react";

// const MenuBar = () => {
//   const [showFileMenu, setShowFileMenu] = useState(false);

//   return (
//     <div className="bg-gray-950 text-white flex px-4 py-2 select-none text-sm">
//       <div
//         className="relative mr-2 cursor-pointer"
//         onMouseEnter={() => setShowFileMenu(true)}
//         onMouseLeave={() => setShowFileMenu(false)}
//       >
//         <span>File</span>
//         {showFileMenu && (
//           <div className="absolute top-full left-0 w-40 bg-gray-950 border border-gray-700 text-sm shadow z-10"> 
//             <ul>
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">New File</li>
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">New Folder</li>
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">New Window</li>
//               <hr className="border-gray-600" /> {/* line */}
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Open File</li>
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Open Folder</li>
//               <hr className="border-gray-600" />
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Save</li>
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Save As</li>
//               <hr className="border-gray-600" />
//               <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Exit</li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuBar;