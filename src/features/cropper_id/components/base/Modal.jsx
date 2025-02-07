import classNames from "classnames";

const Modal = ({ open, children }) => {
  return (
    <div
      className={classNames("fixed z-10 overflow-y-auto top-0 w-full left-0", {
        hidden: !open,
      })}
      id="modal"
    >
      <div className="flex items-center justify-center pt-4 px-4 pb-20 text-center lg:block lg:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <span className="hidden lg:inline-block lg:align-middle lg:h-screen"></span>
          <div
            className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:my-8 lg:align-middle lg:max-w-lg lg:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
// import classNames from "classnames";

// const Modal = ({ open, children }) => {
//   return (
//     <div
//       className={classNames("fixed z-10 overflow-y-auto top-0 w-full left-0", {
//         hidden: !open,
//       })}
//       id="modal"
//     >
//       <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center lg:block lg:p-0">
//         <div className="fixed inset-0 transition-opacity">
//           <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
//           <span className="hidden lg:inline-block lg:align-middle lg:h-screen">
//             ​
//           </span>
//           <div
//             className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:my-8 lg:align-middle lg:max-w-lg lg:w-full"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="modal-headline"
//           >
//             <div className="bg-white px-4 pt-5 pb-4 lg:p-6 lg:pb-4">
//               {children}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
