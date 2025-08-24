// export default function BlackHole() {
//   return (
//     <section className="relative flex items-center justify-center h-[200vh] w-[98vw] bg-black overflow-hidden">
//       {/* Black Hole Background */}  <h1 className="text-4xl font-bold mb-6 text-white absolute top-[120px]">Collaborative Code Editor</h1>
//       <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-800 blur-[150px] opacity-40"></div>
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at center, 
//               rgba(0, 0, 0, 1) 30%, 
//               rgb(42 0 255 / 80%) 40%, 
//               #0060d15e 55%, 
//               rgba(0, 0, 0, 1) 80%)
//           `
//         }}
//       ></div>

//       {/* Main Content */}
//       <h1 className="text-4xl font-bold mb-6 text-white absolute top-[120px]">Collaborative Code Editor</h1>
//      <p className="absolute top-[170px] text-lg text-slate-400 "> alsdjflsdjfljfsd fsdfljsdf sdfjs fsdfisdjf sdfsdlfjsdflsjdfl sdf dldjflksdjf</p>
//     </section>
//   );
// }
import styles from './BlackHole.module.css';

export default function BlackHole() {
  return (
    <div className={styles.bgAnimation}  >
      {/* <div id={styles.stars}></div> */}
      <div id={styles.stars2}></div>
      {/* <div id={styles.stars3}></div> */}
      <div id={styles.stars4}></div>
    </div>
  );
}
