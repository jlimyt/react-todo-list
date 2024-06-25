package com.jlimyt.spring_boot_sample_todo_application.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class CriteriaBuilderUtil {

	public static <T> Predicate predicateArrayContainsAny(
			CriteriaBuilder builder, Path<? extends Collection<T>> path, List<T> values) {
		List<Predicate> subPredicates = new ArrayList<Predicate>();
		values.stream().forEach(value -> {
			Predicate predicate = builder.equal(
					builder.literal("true"),
					builder.function(
							"array_contains",
							values.getFirst().getClass(),
							path,
							builder.literal(value)));
			subPredicates.add(predicate);
		});
		return builder.or(subPredicates.toArray(new Predicate[0]));
	}

	public static <T> Predicate predicateArrayContainsExact(
			CriteriaBuilder builder, Path<? extends Collection<T>> path, List<T> values) {
		return builder.equal(
				builder.literal("true"),
				builder.function(
						"array_contains",
						values.getFirst().getClass(),
						path,
						builder.literal(values)));
	}
}
