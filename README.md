# 3D House Rendering with WebGL and Camera Animation

## About the Code

- This project renders a **3D house** using **WebGL**, utilizing vertex points for shape and color.
- A **camera movement system** is implemented with smooth transitions along a **line**, **circle**, or **Bezier curve**, depending on the user's selection.
- Users can input custom coordinates and control how the camera moves and views the scene.
- Features include:
  - Buttons to **Start**, **Pause**, **Resume**, and **Reset** the animation.
  - A **dropdown** to switch between **Perspective** and **Orthographic** projection views.
  - Real-time updates to the scene based on user inputs.

## Issues Faced

- Initially, the 3D house did not render correctly. The solution involved scaling and adjusting coordinates for correct positioning.
- Handling camera movement across different states (Pause, Resume, Reset) required the use of **flags** and careful state management.
- Switching between perspective and orthographic views introduced **display issues** that had to be debugged and resolved.

## Lessons Learned

- Learned how to create 3D objects using **vertex points** and display them properly with WebGL.
- Understood how to implement **model-view** and **projection matrices** for effective camera and scene control.
- Gained experience in implementing smooth camera motion using **Bezier curves**.
- Improved skills in using **buttons** and **dropdowns** to control and connect UI elements with WebGL code logic.

## Remaining Bugs

- There are **no remaining bugs**.
- All features—camera paths (line, circle, Bezier), projection switching, and animation control buttons—are functioning correctly without any issues.

## Additional Functionalities

- Added **camera animation** features along a **circle** and a **Bezier path** to create smooth and realistic motion.
- Implemented a **projection switch** allowing users to toggle between **Perspective** and **Orthographic** views during animation.
- Included **Pause** and **Reset** buttons to give users full control over camera animation.
- Ensured user-friendly interaction through intuitive UI elements for animation and projection control.

---

## How to Run

1. Clone or download the project files.
2. Open the HTML file in a WebGL-supported browser (e.g., Chrome or Firefox).
3. Use the on-screen controls to:
   - Switch camera animation paths
   - Control animation (start, pause, reset)
   - Change the view between orthographic and perspective
   - Customize coordinates for camera movement
