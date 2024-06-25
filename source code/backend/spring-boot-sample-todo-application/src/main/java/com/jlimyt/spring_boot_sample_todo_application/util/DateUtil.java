package com.jlimyt.spring_boot_sample_todo_application.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
  public static final String DATE_FORMAT = "yyyy-MM-dd";
  
  public static final String RPT_DATE_FORMAT = "dd/MM/yyyy";
  
  public static final String RPT_TIME_FORMAT = "HH:mm:ss";
  
  public static final String RPT_TIME_SHORT_FORMAT = "HH:mm";
  
  public static final String RPT_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
  
  public static final String JSON_DATE_FORMAT = "dd/MM/yyyy";
  
  public static final String JSON_TIME_FORMAT = "HH:mm";
  
  public static final String JSON_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
  
  public static final String SOLR_FULL_DATEIME_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
  
  public static final String SCEHUDLE_REPORT_DATE_SURFIX = "yyyy_MM_dd_HH";
  
  public static final String EMAIL_TIME_SHORT_FORMAT = "HHmm";
  
  public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
  
  public static LocalDateTime getCurrentDateTime() {
    LocalDateTime currentLocalDateTime = LocalDateTime.now();
    return currentLocalDateTime;
  }
  
  public static Boolean overlap(LocalDate startDate1, LocalDate endDate1, LocalDate startDate2, LocalDate endDate2) {
    return ((endDate2 == null || startDate1 == null || !startDate1.isAfter(endDate2)) && (
      endDate1 == null || startDate2 == null || !endDate1.isBefore(startDate2))) ? Boolean.valueOf(true) : Boolean.valueOf(false);
  }
  
  public static Boolean intercept(LocalDate startDate, LocalDate endDate, LocalDate date) {
    return overlap(startDate, endDate, date, null);
  }
  
  public static LocalDateTime getCurrentDate() {
    LocalDateTime currentLocalDateTime = getCurrentDateTime();
    return currentLocalDateTime.truncatedTo(ChronoUnit.DAYS);
  }
  
  public static String formatDate(LocalDateTime localDateTime, String format) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
    return localDateTime.format(formatter);
  }
  
  public static LocalDate parseDate(String dateStr, String format) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
    return LocalDate.parse(dateStr, formatter);
  }
  
  public static long getDiffYears(Date first, Date last) {
    return ChronoUnit.YEARS.between(
        convertToLocalDateTimeViaInstant(first), 
        convertToLocalDateTimeViaInstant(last));
  }
  
  public static long getDiffYearsInLocalDate(LocalDate first, LocalDate last) {
    return ChronoUnit.YEARS.between(first, last);
  }
  
  public static LocalDate convertToLocalDateViaSqlDate(Date dateToConvert) {
    return (new Date(dateToConvert.getTime())).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
  }
  
  public static LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
    return (dateToConvert == null) ? null : dateToConvert.toInstant()
      .atZone(ZoneId.systemDefault())
      .toLocalDateTime();
  }
  
  public static Calendar getCalendar(Date date) {
    Calendar cal = Calendar.getInstance();
    cal.setTimeZone(TimeZone.getTimeZone("Asia/Hong_Kong"));
    cal.setTime(date);
    return cal;
  }
  
  public static Calendar getTodayCalendar() {
    Date date = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTimeZone(TimeZone.getTimeZone("Asia/Hong_Kong"));
    cal.setTime(date);
    return cal;
  }
  
  public static Calendar addDayToCalendar(Date date, int noOfDays) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(date);
    cal.setTimeZone(TimeZone.getTimeZone("Asia/Hong_Kong"));
    cal.add(5, noOfDays);
    return cal;
  }
}
