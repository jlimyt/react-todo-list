package com.jlimyt.spring_boot_sample_todo_application.util;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.domain.Sort;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;

public class ObjectUtil {
  private static final Logger log = LoggerFactory.getLogger(com.jlimyt.spring_boot_sample_todo_application.util.ObjectUtil.class);
  
  protected static final Log logger = LogFactory.getLog(com.jlimyt.spring_boot_sample_todo_application.util.ObjectUtil.class);
  
  private static int CONCURRENCY_MAX_DEPTH = 3;
  
  public static String[] getNullPropertyNames(Object source) {
    BeanWrapperImpl beanWrapperImpl = new BeanWrapperImpl(source);
    PropertyDescriptor[] pds = beanWrapperImpl.getPropertyDescriptors();
    Set<String> emptyNames = new HashSet<>();
    byte b;
    int i;
    PropertyDescriptor[] arrayOfPropertyDescriptor1;
    for (i = (arrayOfPropertyDescriptor1 = pds).length, b = 0; b < i; ) {
      PropertyDescriptor pd = arrayOfPropertyDescriptor1[b];
      Object srcValue = beanWrapperImpl.getPropertyValue(pd.getName());
      if (srcValue == null)
        emptyNames.add(pd.getName()); 
      b++;
    } 
    String[] result = new String[emptyNames.size()];
    return emptyNames.<String>toArray(result);
  }
  
  public static void copyProperties(Object src, Object target) {
    BeanUtils.copyProperties(src, target, getNullPropertyNames(src));
  }
  
  public static void updateCommonFields(BaseModel obj) {
    Long loginUserId = Long.valueOf(2L);
    if (obj.getCreatedAt() == null)
      obj.setCreatedAt(DateUtil.getCurrentDateTime()); 
    if (obj.getCreatedBy() == null && loginUserId != null)
      obj.setCreatedBy(loginUserId); 
    obj.setModifiedAt(DateUtil.getCurrentDateTime());
    if (loginUserId != null)
      obj.setModifiedBy(loginUserId); 
  }
  
  public static <T> void updateModelWithCommonFields(BaseModel<T> model, BaseModel<T> detachedModel, Long txId) {
    updateModelWithCommonFields(model, detachedModel, txId, CONCURRENCY_MAX_DEPTH);
  }
  
  public static <T> void updateModelWithCommonFields(BaseModel<T> model, BaseModel<T> detachedModel, Long txId, int concurrencyMaxDepth) {
    updateModelWithCommonFields(model, detachedModel, txId, concurrencyMaxDepth, 0);
  }
  
  public static <T> void updateModelWithCommonFields(BaseModel<T> model, BaseModel<T> detachedModel, Long txId, int concurrencyMaxDepth, int level) {
    updateModelWithCommonFields(model, detachedModel, txId, concurrencyMaxDepth, level, null);
  }
  
  public static <T> void updateModelWithCommonFields(BaseModel<T> model, BaseModel<T> detachedModel, Long txId, String status) {
    updateModelWithCommonFields(model, detachedModel, txId, CONCURRENCY_MAX_DEPTH, 0, status);
  }
  
  public static <T> void updateModelWithCommonFields(BaseModel<T> model, BaseModel<T> detachedModel, Long txId, int concurrencyMaxDepth, int level, String status) {
    if (level >= concurrencyMaxDepth)
      return; 
    if (detachedModel != null) {
      model.setCreatedAt(detachedModel.getCreatedAt());
      model.setCreatedBy(detachedModel.getCreatedBy());
    } 

    updateCommonFields(model, txId);
    level++;
    Field[] fields = model.getClass().getDeclaredFields();
    byte b;
    int i;
    Field[] arrayOfField1;
    for (i = (arrayOfField1 = fields).length, b = 0; b < i; ) {
      Field field = arrayOfField1[b];
      try {
        if (Collection.class.isAssignableFrom(field.getType())) {
          Type type = field.getGenericType();
          field.setAccessible(true);
          if (type instanceof ParameterizedType) {
            ParameterizedType aType = (ParameterizedType)type;
            Type[] fieldArgTypes = aType.getActualTypeArguments();
            if (fieldArgTypes.length > 0) {
              Class<?> fieldArgClass = (Class)fieldArgTypes[0];
              JsonIgnore ann = field.<JsonIgnore>getAnnotation(JsonIgnore.class);
              if ((ann == null || !ann.value()) && BaseModel.class.isAssignableFrom(fieldArgClass)) {
                Collection<BaseModel> baseModelCollection = (Collection)field.get(model);
                Collection<BaseModel> detachedBaseModelCollection = null;
                if (detachedModel != null)
                  detachedBaseModelCollection = (Collection)field.get(detachedModel); 
                updateModelWithCommonFields(baseModelCollection, detachedBaseModelCollection, txId, concurrencyMaxDepth, level, status);
              } 
            } 
          } 
        } 
      } catch (IllegalArgumentException e) {
        log.error(null, e);
      } catch (IllegalAccessException e) {
        log.error(null, e);
      } catch (SecurityException e) {
        log.error(null, e);
      } catch (Exception e) {
        log.error(null, e);
      } 
      b++;
    } 
  }
  
  public static <R extends BaseModel<T>, T> void updateModelWithCommonFields(Collection<R> collection, Collection<R> detachedCollection, Long txId, int concurrencyMaxDepth, int level, String status) {
    Map<T, R> seqDetachedObjectMap = new HashMap<>();
    if (detachedCollection != null)
      for (BaseModel baseModel : detachedCollection) {
        if (baseModel.getId() != null)
          seqDetachedObjectMap.put((T)baseModel.getId(), (R)baseModel); 
      }  
    if (collection == null)
      collection = new ArrayList<>(); 
    for (BaseModel<?> baseModel : collection)
      updateModelWithCommonFields(baseModel, (BaseModel)seqDetachedObjectMap.get(baseModel.getId()), txId, concurrencyMaxDepth, level, status); 
    List<T> newIds = (List<T>)ListUtil.safeList(collection).stream().map(BaseModel::getId).collect(Collectors.toList());
  }
  
  public static Method getField(Class clazz, String fieldName) {
    Method[] fields = clazz.getMethods();
    byte b;
    int i;
    Method[] arrayOfMethod1;
    for (i = (arrayOfMethod1 = fields).length, b = 0; b < i; ) {
      Method field = arrayOfMethod1[b];
      if (StringUtils.equalsIgnoreCase(field.getName(), "get" + fieldName))
        return field; 
      b++;
    } 
    return null;
  }
  
  public static Object getFieldValue(Class clazz, String fieldName, Object record) {
    Method method = getField(clazz, fieldName);
    Object value = null;
    if (method != null)
      try {
        value = method.invoke(record, new Object[0]);
      } catch (IllegalArgumentException e) {
        log.error(null, e);
      } catch (IllegalAccessException e) {
        log.error(null, e);
      } catch (InvocationTargetException e) {
        log.error(null, e);
      }  
    return value;
  }
  
  public static void updateCommonFields(BaseModel obj, Long txId) {
    Long loginUserId = CommonUtil.getLoginUserId();
    if (loginUserId == null)
      loginUserId = LoginUser.SYSTEMID; 
    if (obj.getCreatedAt() == null)
      obj.setCreatedAt(DateUtil.getCurrentDateTime()); 
    if (obj.getCreatedBy() == null)
      obj.setCreatedBy(loginUserId); 
    obj.setModifiedAt(DateUtil.getCurrentDateTime());
    obj.setModifiedBy(loginUserId);
  }
  
  public static <T> Sort getSortFromModel(BaseModel<T> model) {
    return getSortFromModel(model.getSortFields(), model.getSortDirection());
  }
  
  public static Sort getSortFromModel(List<String> sortFields, Sort.Direction sortDirection) {
    return getSortFromModel(sortFields, sortDirection, Boolean.valueOf(true));
  }
  
  public static Sort getSortFromModel(List<String> sortFields, Sort.Direction sortDirection, Boolean ignoreCase) {
    return Sort.by(sortFields.stream()
        .map(field -> {
            Sort.Order order = new Sort.Order(sortDirection, field);
            if (ignoreCase.booleanValue())
              order.ignoreCase(); 
            return order;
          }).collect(Collectors.toList()));
  }
  
  public static boolean setField(Class clazz, String fieldName, Object object, Object value) {
    Method[] methods = clazz.getMethods();
    byte b;
    int i;
    Method[] arrayOfMethod1;
    for (i = (arrayOfMethod1 = methods).length, b = 0; b < i; ) {
      Method field = arrayOfMethod1[b];
      if (StringUtils.equalsIgnoreCase(field.getName(), "set" + fieldName)) {
        try {
          field.invoke(object, new Object[] { value });
        } catch (IllegalArgumentException e) {
          log.error(null, e);
          return false;
        } catch (IllegalAccessException e) {
          log.error(null, e);
          return false;
        } catch (InvocationTargetException e) {
          log.error(null, e);
          return false;
        } 
        return true;
      } 
      b++;
    } 
    return false;
  }
}
