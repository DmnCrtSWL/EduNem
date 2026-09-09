import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '../ui/Icon';
import { useTheme } from '../../context/ThemeContext';

export default function SOSModal({ student, action, onClose, onConfirm }) {
  const { theme } = useTheme();
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!student || !action) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onConfirm(student, action, comment);
    }, 400);
  };

  const isDiscipline = action.id === 'discipline';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[
          styles.card,
          {
            backgroundColor: theme.colors.bgMobile,
            borderColor: isDiscipline ? theme.colors.danger : theme.colors.info,
            borderWidth: 1.5
          }
        ]}>
          <View style={[
            styles.iconCircle,
            { backgroundColor: isDiscipline ? (theme.isDark ? 'rgba(220, 38, 38, 0.25)' : '#fee2e2') : (theme.isDark ? 'rgba(37, 99, 235, 0.25)' : '#e0f2fe') }
          ]}>
            <Icon 
              name={typeof action.icon === 'string' ? action.icon : (isDiscipline ? 'shield-alert' : 'heart-pulse')} 
              size={28} 
              color={isDiscipline ? theme.colors.danger : theme.colors.info} 
            />
          </View>

          <Text style={[styles.titleText, { color: theme.colors.textMain }]}>
            {action.label}
          </Text>

          <Text style={[styles.subText, { color: theme.colors.textMuted }]}>
            ¿Estás seguro de enviar esta notificación en tiempo real para el alumno <Text style={[styles.boldText, { color: theme.colors.textMain }]}>{student.name}</Text> (#{student.listNumber})?
          </Text>

          <View style={[styles.inputBox, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>
              💬 Nota rápida opcional para {isDiscipline ? 'Prefectura' : 'Orientación'} (Máx 2 líneas):
            </Text>
            <TextInput
              placeholder={isDiscipline ? 'Ej: Salió del aula sin autorización / Falta de respeto...' : 'Ej: Dolor de cabeza severo / Solicita ver a su tutor...'}
              placeholderTextColor={theme.colors.textMuted}
              value={comment}
              onChangeText={setComment}
              style={[styles.textInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[styles.cancelBtnText, { color: theme.colors.textMain }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSend}
              disabled={isSending}
              style={[styles.confirmBtn, { backgroundColor: isDiscipline ? theme.colors.danger : theme.colors.info }, isSending && { opacity: 0.7 }]}
            >
              {isSending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>Enviar Alerta</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 13.5,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '800',
  },
  inputBox: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '700',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
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
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
});

