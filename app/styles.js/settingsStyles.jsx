import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  card: { backgroundColor: "#f9f9f9", padding: 20, borderRadius: 10, marginBottom: 15 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  profileEmail: { color: 'gray' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingText: { fontSize: 16, color: '#000' },
  redButton: { backgroundColor: "#C67C4E", borderRadius: 10, padding: 20 },
  redText: { fontSize: 16, color: "white", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', width: '85%', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#C67C4E' },
  modalInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15, color: '#000' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { backgroundColor: '#C67C4E', padding: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold' }
});

export default styles;
