import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ListPC from "./pages/ListPC";
import Storage from "./pages/Storage";
import StorageSSD from "./pages/StorageSSD";
import StorageHDD from "./pages/StorageHDD";
import StorageFlashdisk from "./pages/StorageFlashdisk";
import StorageHealth from "./pages/StorageHealth";
import Hardware from "./pages/Hardware";
import HardwareRAM from "./pages/HardwareRAM";
import HardwareBattery from "./pages/HardwareBattery";
import Peripherals from "./pages/Peripherals";
import PeripheralsKeyboard from "./pages/PeripheralsKeyboard";
import PeripheralsCombo from "./pages/PeripheralsCombo";
import PeripheralsWebcam from "./pages/PeripheralsWebcam";
import PeripheralsHeadphone from "./pages/PeripheralsHeadphone";
import PeripheralsMultiportUSB from "./pages/PeripheralsMultiportUSB";
import PeripheralsHDMIPort from "./pages/PeripheralsHDMIPort";
import Network from "./pages/Network";
import NetworkDongleWIFI from "./pages/NetworkDongleWIFI";
import NetworkPort from "./pages/NetworkPort";
import NetworkFortiSwitch from "./pages/NetworkFortiSwitch";
import NetworkMSW from "./pages/NetworkMSW";
import NetworkMouse from "./pages/NetworkMouse";
import DeviceOfficeOutput from "./pages/DeviceOfficeOutput";
import DeviceOfficeOutputTablet from "./pages/DeviceOfficeOutputTablet";
import DeviceOfficeOutputCast from "./pages/DeviceOfficeOutputCast";
import DeviceOfficeOutputPrinter from "./pages/DeviceOfficeOutputPrinter";
import DeviceOfficeOutputUPS from "./pages/DeviceOfficeOutputUPS";
import Admin from "./pages/Admin";
import MainLayout from "./layouts/MainLayout";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Main App */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/list-pc"
            element={<ListPC />}
          />
          <Route
            path="/storage"
            element={<Storage />}
          />
          <Route
            path="/storage/ssd"
            element={<StorageSSD />}
          />
          <Route
            path="/storage/hdd"
            element={<StorageHDD />}
          />
          <Route
            path="/storage/flashdisk"
            element={<StorageFlashdisk />}
          />
          <Route
            path="/storage/health"
            element={<StorageHealth />}
          />
          <Route
            path="/hardware"
            element={<Hardware />}
          />
          <Route
            path="/hardware/ram"
            element={<HardwareRAM />}
          />
          <Route
            path="/hardware/battery"
            element={<HardwareBattery />}
          />
          <Route
            path="/peripherals"
            element={<Peripherals />}
          />
          <Route
            path="/peripherals/keyboard"
            element={<PeripheralsKeyboard />}
          />
          <Route
            path="/peripherals/combo"
            element={<PeripheralsCombo />}
          />
          <Route
            path="/peripherals/webcam"
            element={<PeripheralsWebcam />}
          />
          <Route
            path="/peripherals/headphone"
            element={<PeripheralsHeadphone />}
          />
          <Route
            path="/peripherals/multiport-usb"
            element={<PeripheralsMultiportUSB />}
          />
          <Route
            path="/peripherals/hdmi-port"
            element={<PeripheralsHDMIPort />}
          />
          <Route
            path="/network"
            element={<Network />}
          />
          <Route
            path="/network/donglewifi"
            element={<NetworkDongleWIFI />}
          />
          <Route
            path="/network/port"
            element={<NetworkPort />}
          />
          <Route
            path="/network/fortiswitch"
            element={<NetworkFortiSwitch />}
          />
          <Route
            path="/network/msw"
            element={<NetworkMSW />}
          />
          <Route
            path="/network/mouse"
            element={<NetworkMouse />}
          />
          <Route
            path="/deviceofficeoutput"
            element={<DeviceOfficeOutput />}
          />
          <Route
            path="/deviceofficeoutput/tablet"
            element={<DeviceOfficeOutputTablet />}
          />
          <Route
            path="/deviceofficeoutput/cast"
            element={<DeviceOfficeOutputCast />}
          />
          <Route
            path="/deviceofficeoutput/printer"
            element={<DeviceOfficeOutputPrinter />}
          />
          <Route
            path="/deviceofficeoutput/ups"
            element={<DeviceOfficeOutputUPS />}
          />
          <Route
            path="/admin"
            element={<Admin />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
