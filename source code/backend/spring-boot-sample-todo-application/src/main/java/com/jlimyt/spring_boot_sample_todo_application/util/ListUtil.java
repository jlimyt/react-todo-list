package com.jlimyt.spring_boot_sample_todo_application.util;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

public class ListUtil {
  public static <R> Collection<R> safeList(Collection<R> list) {
    return CollectionUtils.isEmpty(list) ? new ArrayList<>() : list;
  }
  
  public static String[] concatWithCollection(String[] array1, String[] array2) {
    List<String> resultList = new ArrayList<>(array1.length + array2.length);
    Collections.addAll(resultList, array1);
    Collections.addAll(resultList, array2);
    resultList = (List<String>)resultList.stream().filter(x -> (x != null && !StringUtils.isEmpty(x))).collect(Collectors.toList());
    String[] resultArray = (String[])Array.newInstance(array1.getClass().getComponentType(), 0);
    return resultList.<String>toArray(resultArray);
  }
}
