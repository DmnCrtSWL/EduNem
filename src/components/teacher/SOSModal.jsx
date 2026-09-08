import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/tokens';

export default function SOSModal({ student, action, onClose, onConfirm }) {
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!student || !action) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onConfirm(student, action, comment);
    }, 800);
  };

  const isDiscipline = action.id === 'discipline';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDiscipline ? styles.disciplineCard : styles.infoCard]}>
          <Text style={styles.iconText}>
            {action.icon}
          </Text>

          <Text style={styles.titleText}>
            {action.label}
          </Text>

          <Text style={styles.subText}>
            ¿Estás seguro de enviar esta notificación en tiempo real para el alumno <Text style={styles.boldText}>{student.name}</Text> (#{student.listNumber})?
          </Text>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>
              💬 Nota rápida opcional para {isDiscipline ? 'Prefectura' : 'Orientación'} (Máx 2 líneas):
            </Text>
            <TextInput
              placeholder={isDiscipline ? 'Ej: Salió del aula sin autorización / Falta de respeto...' : 'Ej: Dolor de cabeza severo / Solicita ver a su tutor...'}
              placeholderTextColor="#94a3b8"
              value={comment}
              onChangeText={setComment}
              style={styles.textInput}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSend}
              disabled={isSending}
              style={[styles.confirmBtn, isDiscipline ? styles.confirmBtnDiscipline : styles.confirmBtnInfo, isSending && { opacity: 0.7 }]}
            >
              {isSending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>🚨 Confirmar Alerta (1-Tap)</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#131b2e',
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  disciplineCard: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  infoCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  iconText: {
    fontSize: 48,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  inputBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#ffffff',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDiscipline: {
    backgroundColor: '#ef4444',
  },
  confirmBtnInfo: {
    backgroundColor: '#3b82f6',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
});

