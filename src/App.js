import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { AdminProvider } from "./context/AdminContext";
import { TicketProvider } from "./context/TicketContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/HomePage";
import Events from "./pages/Events";
import MyTickets from "./pages/MyTickets";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/layout/PrivateRoute";
import AdminRoute from "./components/layout/AdminRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PaymentSuccess from "./pages/PaymentSuccess";
import EventDetails from "./components/events/EventDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <AdminProvider>
            <TicketProvider>
              <div className="app">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route
                      path="/payment-success"
                      element={<PaymentSuccess />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                      path="/my-tickets"
                      element={
                        <PrivateRoute>
                          <MyTickets />
                        </PrivateRoute>
                      }
                    />

                    {/* Admin routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </TicketProvider>
          </AdminProvider>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
