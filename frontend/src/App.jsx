import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Droplets,
  Leaf,
  Thermometer,
  Gauge,
  CalendarDays,
  Sprout,
  FlaskConical,
  Settings,
  Bell,
  User,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  LogOut,
  RefreshCcw,
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { monitoringAPI } from "./api/api";

function toDateInput(value) {
  if (!value) return "";
  return String(value).split("T")[0];
}

function toDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function getCurrentDateTimeLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function formatNotificationTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatCard({ title, value, icon, status }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{status}</span>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ field, value, onChange, tanaman, sensor }) {
  if (field.type === "select-tanaman") {
    return (
      <label>
        {field.label}
        <select
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">Pilih tanaman</option>
          {tanaman.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_tanaman}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "select-sensor") {
    return (
      <label>
        {field.label}
        <select
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">Pilih sensor</option>
          {sensor.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_sensor}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label>
        {field.label}
        <select
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">Pilih data</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label>
        {field.label}
        <textarea
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      </label>
    );
  }

  return (
    <label>
      {field.label}
      <input
        type={field.type || "text"}
        step={field.step}
        value={value || ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
      />
    </label>
  );
}

function CrudPage({
  title,
  subtitle,
  endpoint,
  columns,
  fields,
  initialForm,
  search,
  tanaman,
  sensor,
  beforeSave,
  afterLoad,
  createNotification,
}) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await monitoringAPI.get(endpoint);
      const result = response.data.data || [];
      setData(afterLoad ? result.map(afterLoad) : result);
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint]);

  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);

    const newForm = { ...initialForm };

    Object.keys(newForm).forEach((key) => {
      if (key.includes("tanggal")) {
        newForm[key] = toDateInput(item[key]);
      } else if (key.includes("waktu")) {
        newForm[key] = toDateTimeInput(item[key]);
      } else {
        newForm[key] = item[key] ?? "";
      }
    });

    setForm(newForm);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = beforeSave ? beforeSave(form) : form;

      if (editingId) {
        await monitoringAPI.put(`${endpoint}/${editingId}`, payload);

        await createNotification({
          title: `${title} diperbarui`,
          message: `Data pada menu ${title} berhasil diperbarui.`,
          type: "update",
        });

        alert("Data berhasil diperbarui");
      } else {
        await monitoringAPI.post(endpoint, payload);

        await createNotification({
          title: `${title} ditambahkan`,
          message: `Data baru pada menu ${title} berhasil ditambahkan.`,
          type: "create",
        });

        alert("Data berhasil ditambahkan");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(initialForm);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus data ini?");

    if (!yakin) return;

    try {
      await monitoringAPI.delete(`${endpoint}/${id}`);

      await createNotification({
        title: `${title} dihapus`,
        message: `Data pada menu ${title} berhasil dihapus.`,
        type: "delete",
      });

      alert("Data berhasil dihapus");
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus data");
    }
  };

  return (
    <>
      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <div className="header-actions">
            <button type="button" onClick={loadData}>
              <RefreshCcw size={16} /> Refresh
            </button>

            <button type="button" onClick={openCreate}>
              <Plus size={16} /> Tambah Data
            </button>
          </div>
        </div>

        {message && <div className="page-alert">{message}</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="empty-data">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="empty-data">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}

                    <td>
                      <div className="action-buttons">
                        <button type="button" onClick={() => openEdit(item)}>
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <Modal
          title={editingId ? `Edit ${title}` : `Tambah ${title}`}
          onClose={() => setShowModal(false)}
        >
          <form className="form-grid" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={handleChange}
                tanaman={tanaman}
                sensor={sensor}
              />
            ))}

            <button type="submit" className="submit-button">
              {editingId ? "Update Data" : "Simpan Data"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Dashboard({ setPage, tanaman, sensor, monitoring, jadwal }) {
  const latestMonitoring = monitoring[0];

  return (
    <>
      <section className="stats-grid">
        <StatCard
          title="Tanaman Aktif"
          value={tanaman.length}
          status="Data dari database"
          icon={<Sprout size={28} />}
        />

        <StatCard
          title="Sensor Aktif"
          value={sensor.length}
          status="Terdaftar di sistem"
          icon={<Gauge size={28} />}
        />

        <StatCard
          title="pH Terbaru"
          value={latestMonitoring?.ph || "-"}
          status="Monitoring terakhir"
          icon={<Droplets size={28} />}
        />

        <StatCard
          title="Suhu Air"
          value={latestMonitoring?.suhu_air ? `${latestMonitoring.suhu_air}°C` : "-"}
          status="Monitoring terakhir"
          icon={<Thermometer size={28} />}
        />
      </section>

      <section className="content-grid">
        <div className="panel large">
          <div className="panel-header">
            <div>
              <h2>Grafik Monitoring</h2>
              <p>Ringkasan perkembangan pH, suhu, dan nutrisi</p>
            </div>
            <button type="button" onClick={() => setPage("Monitoring")}>
              Lihat Detail
            </button>
          </div>

          <div className="chart-placeholder">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
            <div className="bar bar-6"></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header simple">
            <h2>Jadwal Terbaru</h2>
          </div>

          <div className="schedule-list">
            {jadwal.slice(0, 3).map((item) => (
              <div className="schedule-item" key={item.id}>
                <span></span>
                <div>
                  <h4>{item.kegiatan}</h4>
                  <p>
                    {item.nama_tanaman || `Tanaman ID ${item.tanaman_id}`} -{" "}
                    {toDateInput(item.tanggal_jadwal)}
                  </p>
                </div>
              </div>
            ))}

            {jadwal.length === 0 && (
              <p className="empty-mini">Belum ada jadwal</p>
            )}
          </div>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h2>Data Monitoring Terbaru</h2>
            <p>Data kondisi tanaman hidroponik terakhir dari database</p>
          </div>
          <button type="button" onClick={() => setPage("Monitoring")}>
            Tambah Data
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tanaman</th>
                <th>Sensor</th>
                <th>pH</th>
                <th>Suhu Air</th>
                <th>PPM</th>
                <th>Kelembaban</th>
              </tr>
            </thead>

            <tbody>
              {monitoring.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td>{item.nama_tanaman || item.tanaman_id}</td>
                  <td>{item.nama_sensor || item.sensor_id}</td>
                  <td>{item.ph}</td>
                  <td>{item.suhu_air}°C</td>
                  <td>{item.ppm}</td>
                  <td>{item.kelembaban}%</td>
                </tr>
              ))}

              {monitoring.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-data">
                    Belum ada data monitoring
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PengaturanPage() {
  return (
    <section className="panel table-panel">
      <div className="panel-header simple">
        <div>
          <h2>Pengaturan</h2>
          <p>Informasi aplikasi dan koneksi service</p>
        </div>
      </div>

      <div className="settings-box">
        <div>
          <h3>Nama Aplikasi</h3>
          <p>HydroCloud - Smart Hydroponic Monitoring</p>
        </div>

        <div>
          <h3>Status Auth Service</h3>
          <p>Terhubung ke http://localhost:5001/api/auth</p>
        </div>

        <div>
          <h3>Status Monitoring Service</h3>
          <p>Terhubung ke http://localhost:5002/api</p>
        </div>

        <div>
          <h3>Status Notifikasi</h3>
          <p>Terhubung ke tabel notifications pada database MySQL.</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authPage, setAuthPage] = useState("login");
  const [userLogin, setUserLogin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tanaman, setTanaman] = useState([]);
  const [sensor, setSensor] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [jadwal, setJadwal] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const menus = useMemo(
    () => [
      { name: "Dashboard", icon: <Activity size={20} /> },
      { name: "Data Tanaman", icon: <Sprout size={20} /> },
      { name: "Data Sensor", icon: <Gauge size={20} /> },
      { name: "Monitoring", icon: <Droplets size={20} /> },
      { name: "Nutrisi", icon: <FlaskConical size={20} /> },
      { name: "Jadwal", icon: <CalendarDays size={20} /> },
      { name: "Pengaturan", icon: <Settings size={20} /> },
    ],
    []
  );

  const loadDashboardData = async () => {
    try {
      const [tanamanRes, sensorRes, monitoringRes, jadwalRes] =
        await Promise.all([
          monitoringAPI.get("/tanaman"),
          monitoringAPI.get("/sensor"),
          monitoringAPI.get("/monitoring"),
          monitoringAPI.get("/jadwal"),
        ]);

      setTanaman(tanamanRes.data.data || []);
      setSensor(sensorRes.data.data || []);
      setMonitoring(monitoringRes.data.data || []);
      setJadwal(jadwalRes.data.data || []);
    } catch (error) {
      console.log("Gagal load dashboard:", error.response?.data || error.message);
    }
  };

  const loadNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        monitoringAPI.get("/notifications"),
        monitoringAPI.get("/notifications/unread-count"),
      ]);

      setNotifications(notifRes.data.data || []);
      setUnreadCount(countRes.data.total || 0);
    } catch (error) {
      console.log(
        "Gagal mengambil notifikasi:",
        error.response?.data || error.message
      );
    }
  };

  const createNotification = async ({ title, message, type }) => {
    try {
      await monitoringAPI.post("/notifications", {
        title,
        message,
        type,
      });

      await loadNotifications();
    } catch (error) {
      console.log(
        "Gagal membuat notifikasi:",
        error.response?.data || error.message
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await monitoringAPI.put("/notifications/read-all");
      await loadNotifications();
    } catch (error) {
      console.log(
        "Gagal update notifikasi:",
        error.response?.data || error.message
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await monitoringAPI.delete(`/notifications/${id}`);
      await loadNotifications();
    } catch (error) {
      console.log(
        "Gagal hapus notifikasi:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
      loadNotifications();
    }
  }, [token, page]);

  const handleLoginSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUserLogin(data.user);
    setPage("Dashboard");
  };

  const handleLogout = () => {
    const yakin = window.confirm("Yakin ingin logout?");

    if (yakin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUserLogin(null);
      setPage("Dashboard");
      setShowNotifications(false);
    }
  };

  if (!token) {
    if (authPage === "login") {
      return (
        <Login
          onLogin={handleLoginSuccess}
          goRegister={() => setAuthPage("register")}
        />
      );
    }

    return <Register goLogin={() => setAuthPage("login")} />;
  }

  const renderPage = () => {
    if (page === "Dashboard") {
      return (
        <Dashboard
          setPage={setPage}
          tanaman={tanaman}
          sensor={sensor}
          monitoring={monitoring}
          jadwal={jadwal}
        />
      );
    }

    if (page === "Data Tanaman") {
      return (
        <CrudPage
          title="Data Tanaman"
          subtitle="CRUD data tanaman hidroponik langsung ke database"
          endpoint="/tanaman"
          search={search}
          tanaman={tanaman}
          sensor={sensor}
          createNotification={createNotification}
          initialForm={{
            nama_tanaman: "",
            jenis_tanaman: "",
            tanggal_tanam: "",
            status: "aktif",
            user_id: userLogin?.id || 1,
          }}
          fields={[
            {
              name: "nama_tanaman",
              label: "Nama Tanaman",
              placeholder: "Contoh: Selada Hijau",
              required: true,
            },
            {
              name: "jenis_tanaman",
              label: "Jenis Tanaman",
              placeholder: "Contoh: Sayuran Daun",
              required: true,
            },
            {
              name: "tanggal_tanam",
              label: "Tanggal Tanam",
              type: "date",
              required: true,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "aktif", label: "Aktif" },
                { value: "panen", label: "Panen" },
                { value: "mati", label: "Mati" },
              ],
            },
          ]}
          columns={[
            { key: "nama_tanaman", label: "Nama Tanaman" },
            { key: "jenis_tanaman", label: "Jenis" },
            {
              key: "tanggal_tanam",
              label: "Tanggal Tanam",
              render: (item) => toDateInput(item.tanggal_tanam),
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <span className="badge success">{item.status}</span>
              ),
            },
          ]}
          beforeSave={(form) => ({
            ...form,
            user_id: userLogin?.id || 1,
          })}
          afterLoad={(item) => ({
            ...item,
            tanggal_tanam: toDateInput(item.tanggal_tanam),
          })}
        />
      );
    }

    if (page === "Data Sensor") {
      return (
        <CrudPage
          title="Data Sensor"
          subtitle="CRUD data sensor hidroponik langsung ke database"
          endpoint="/sensor"
          search={search}
          tanaman={tanaman}
          sensor={sensor}
          createNotification={createNotification}
          initialForm={{
            nama_sensor: "",
            tipe_sensor: "",
            lokasi: "",
            status: "aktif",
          }}
          fields={[
            {
              name: "nama_sensor",
              label: "Nama Sensor",
              placeholder: "Contoh: Sensor pH",
              required: true,
            },
            {
              name: "tipe_sensor",
              label: "Tipe Sensor",
              placeholder: "Analog / Digital",
              required: true,
            },
            {
              name: "lokasi",
              label: "Lokasi",
              placeholder: "Contoh: Bak Nutrisi 1",
              required: true,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "aktif", label: "Aktif" },
                { value: "rusak", label: "Rusak" },
                { value: "nonaktif", label: "Nonaktif" },
              ],
            },
          ]}
          columns={[
            { key: "nama_sensor", label: "Nama Sensor" },
            { key: "tipe_sensor", label: "Tipe" },
            { key: "lokasi", label: "Lokasi" },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <span className="badge success">{item.status}</span>
              ),
            },
          ]}
        />
      );
    }

    if (page === "Monitoring") {
      return (
        <CrudPage
          title="Monitoring"
          subtitle="CRUD data monitoring pH, suhu, PPM, dan kelembaban"
          endpoint="/monitoring"
          search={search}
          tanaman={tanaman}
          sensor={sensor}
          createNotification={createNotification}
          initialForm={{
            tanaman_id: "",
            sensor_id: "",
            ph: "",
            suhu_air: "",
            ppm: "",
            kelembaban: "",
            waktu_monitoring: getCurrentDateTimeLocal(),
          }}
          fields={[
            {
              name: "tanaman_id",
              label: "Tanaman",
              type: "select-tanaman",
              required: true,
            },
            {
              name: "sensor_id",
              label: "Sensor",
              type: "select-sensor",
              required: true,
            },
            {
              name: "ph",
              label: "pH Air",
              type: "number",
              step: "0.1",
              placeholder: "Contoh: 6.2",
              required: true,
            },
            {
              name: "suhu_air",
              label: "Suhu Air",
              type: "number",
              step: "0.1",
              placeholder: "Contoh: 25.5",
              required: true,
            },
            {
              name: "ppm",
              label: "PPM",
              type: "number",
              placeholder: "Contoh: 850",
              required: true,
            },
            {
              name: "kelembaban",
              label: "Kelembaban",
              type: "number",
              step: "0.1",
              placeholder: "Contoh: 70",
              required: true,
            },
            {
              name: "waktu_monitoring",
              label: "Waktu Monitoring",
              type: "datetime-local",
              required: true,
            },
          ]}
          columns={[
            {
              key: "nama_tanaman",
              label: "Tanaman",
              render: (item) => item.nama_tanaman || item.tanaman_id,
            },
            {
              key: "nama_sensor",
              label: "Sensor",
              render: (item) => item.nama_sensor || item.sensor_id,
            },
            { key: "ph", label: "pH" },
            {
              key: "suhu_air",
              label: "Suhu Air",
              render: (item) => `${item.suhu_air}°C`,
            },
            { key: "ppm", label: "PPM" },
            {
              key: "kelembaban",
              label: "Kelembaban",
              render: (item) => `${item.kelembaban}%`,
            },
            {
              key: "waktu_monitoring",
              label: "Waktu",
              render: (item) =>
                toDateTimeInput(item.waktu_monitoring).replace("T", " "),
            },
          ]}
          beforeSave={(form) => ({
            ...form,
            tanaman_id: Number(form.tanaman_id),
            sensor_id: Number(form.sensor_id),
            ph: Number(form.ph),
            suhu_air: Number(form.suhu_air),
            ppm: Number(form.ppm),
            kelembaban: Number(form.kelembaban),
            waktu_monitoring: form.waktu_monitoring.replace("T", " "),
          })}
          afterLoad={(item) => ({
            ...item,
            waktu_monitoring: toDateTimeInput(item.waktu_monitoring),
          })}
        />
      );
    }

    if (page === "Nutrisi") {
      return (
        <CrudPage
          title="Nutrisi"
          subtitle="CRUD data pemberian nutrisi tanaman"
          endpoint="/nutrisi"
          search={search}
          tanaman={tanaman}
          sensor={sensor}
          createNotification={createNotification}
          initialForm={{
            tanaman_id: "",
            jenis_nutrisi: "",
            jumlah_ml: "",
            tanggal_pemberian: "",
            keterangan: "",
          }}
          fields={[
            {
              name: "tanaman_id",
              label: "Tanaman",
              type: "select-tanaman",
              required: true,
            },
            {
              name: "jenis_nutrisi",
              label: "Jenis Nutrisi",
              placeholder: "Contoh: AB Mix",
              required: true,
            },
            {
              name: "jumlah_ml",
              label: "Jumlah ML",
              type: "number",
              placeholder: "Contoh: 50",
              required: true,
            },
            {
              name: "tanggal_pemberian",
              label: "Tanggal Pemberian",
              type: "date",
              required: true,
            },
            {
              name: "keterangan",
              label: "Keterangan",
              type: "textarea",
              placeholder: "Catatan pemberian nutrisi",
            },
          ]}
          columns={[
            {
              key: "nama_tanaman",
              label: "Tanaman",
              render: (item) => item.nama_tanaman || item.tanaman_id,
            },
            { key: "jenis_nutrisi", label: "Jenis Nutrisi" },
            {
              key: "jumlah_ml",
              label: "Jumlah",
              render: (item) => `${item.jumlah_ml} ml`,
            },
            {
              key: "tanggal_pemberian",
              label: "Tanggal",
              render: (item) => toDateInput(item.tanggal_pemberian),
            },
            { key: "keterangan", label: "Keterangan" },
          ]}
          beforeSave={(form) => ({
            ...form,
            tanaman_id: Number(form.tanaman_id),
            jumlah_ml: Number(form.jumlah_ml),
          })}
          afterLoad={(item) => ({
            ...item,
            tanggal_pemberian: toDateInput(item.tanggal_pemberian),
          })}
        />
      );
    }

    if (page === "Jadwal") {
      return (
        <CrudPage
          title="Jadwal"
          subtitle="CRUD jadwal perawatan tanaman hidroponik"
          endpoint="/jadwal"
          search={search}
          tanaman={tanaman}
          sensor={sensor}
          createNotification={createNotification}
          initialForm={{
            tanaman_id: "",
            kegiatan: "",
            tanggal_jadwal: "",
            status: "belum",
            catatan: "",
          }}
          fields={[
            {
              name: "tanaman_id",
              label: "Tanaman",
              type: "select-tanaman",
              required: true,
            },
            {
              name: "kegiatan",
              label: "Kegiatan",
              placeholder: "Contoh: Cek pH Air",
              required: true,
            },
            {
              name: "tanggal_jadwal",
              label: "Tanggal Jadwal",
              type: "date",
              required: true,
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              required: true,
              options: [
                { value: "belum", label: "Belum" },
                { value: "selesai", label: "Selesai" },
              ],
            },
            {
              name: "catatan",
              label: "Catatan",
              type: "textarea",
              placeholder: "Catatan jadwal",
            },
          ]}
          columns={[
            {
              key: "nama_tanaman",
              label: "Tanaman",
              render: (item) => item.nama_tanaman || item.tanaman_id,
            },
            { key: "kegiatan", label: "Kegiatan" },
            {
              key: "tanggal_jadwal",
              label: "Tanggal",
              render: (item) => toDateInput(item.tanggal_jadwal),
            },
            {
              key: "status",
              label: "Status",
              render: (item) => (
                <span
                  className={`badge ${
                    item.status === "selesai" ? "success" : "warning"
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            { key: "catatan", label: "Catatan" },
          ]}
          beforeSave={(form) => ({
            ...form,
            tanaman_id: Number(form.tanaman_id),
          })}
          afterLoad={(item) => ({
            ...item,
            tanggal_jadwal: toDateInput(item.tanggal_jadwal),
          })}
        />
      );
    }

    if (page === "Pengaturan") {
      return <PengaturanPage />;
    }

    return null;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Leaf size={26} />
          </div>
          <div>
            <h2>HydroCloud</h2>
            <p>Smart Hydroponic</p>
          </div>
        </div>

        <nav className="menu">
          {menus.map((menu) => (
            <button
              key={menu.name}
              className={page === menu.name ? "active" : ""}
              onClick={() => {
                setPage(menu.name);
                setSearch("");
                setShowNotifications(false);
              }}
            >
              {menu.icon}
              {menu.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page === "Dashboard" ? "Dashboard Hidroponik" : page}</h1>
            <p>Pemantauan kondisi tanaman hidroponik secara real-time</p>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Cari data..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="notification-wrapper">
              <button
                className="icon-button notification-button"
                type="button"
                onClick={async () => {
                  setShowNotifications(!showNotifications);

                  if (!showNotifications) {
                    await markAllNotificationsAsRead();
                  }
                }}
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <div>
                      <h3>Notifikasi</h3>
                      <p>{notifications.length} aktivitas terbaru</p>
                    </div>

                    <button type="button" onClick={loadNotifications}>
                      Refresh
                    </button>
                  </div>

                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        Belum ada notifikasi
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          className={`notification-item ${
                            item.is_read === 0 ? "unread" : ""
                          }`}
                          key={item.id}
                        >
                          <div>
                            <h4>{item.title}</h4>
                            <p>{item.message}</p>
                            <span>
                              {formatNotificationTime(item.created_at)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteNotification(item.id)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile">
              <div className="avatar">
                <User size={18} />
              </div>
              <div>
                <h4>{userLogin?.name || "Admin"}</h4>
                <p>{userLogin?.role || "Pengelola"}</p>
              </div>
            </div>

            <button
              className="icon-button logout-button"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;