package com.jlimyt.spring_boot_sample_todo_application.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.convert.QueryByExamplePredicateBuilder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;
import com.jlimyt.spring_boot_sample_todo_application.service.BaseService;
import com.jlimyt.spring_boot_sample_todo_application.util.ObjectUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = {"*"})
public abstract class BaseController<M extends BaseModel<T>, T, S extends BaseService<M, T>> {
  private static final Logger log = LoggerFactory.getLogger(com.jlimyt.spring_boot_sample_todo_application.controller.BaseController.class);
  @Autowired
  protected BaseService<M, T> baseService;
  
  protected String controllerPrefix;
  
  protected Boolean includeSpecificationFromModel = Boolean.valueOf(true);
  
  public ExampleMatcher getMatcher(M model) {
    return ExampleMatcher.matching().withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING).withIgnoreCase();
  }
  
  @PostMapping({"/list"})
  public List<M> list(@RequestBody M model) {
    Specification<M> specification = getSpecificationFromModelAndExample(model, Example.of(model, getMatcher(model)));
    List<M> result = this.baseService.findAll(specification, ObjectUtil.getSortFromModel(model));
    return result;
  }
 
  private Sort.Direction replaceOrderStringThroughDirection(String sortDirection) {
      if (sortDirection.equalsIgnoreCase("DESC")){
          return Sort.Direction.DESC;
      } else {
          return Sort.Direction.ASC;
      }
  }

  @PostMapping({"/search"})
  @Operation(
			summary = "Search record",
			description = "Search a record base on criteria",
			parameters = {
					@Parameter(name = "page", description = "Page of the search"),
					@Parameter(name = "size", description = "Page size of the search"),
					@Parameter(name = "sort", description = "Sorting fields"),
					},
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
  public ResponseEntity<Page<M>> search(
		  @RequestBody M model,
          @RequestParam(value = "page", defaultValue = "0", required = false) int page,
          @RequestParam(value = "size", defaultValue = "10", required = false) int size,
          @RequestParam(value = "sort", defaultValue = "id,ASC", required = false) String sort,
          HttpServletRequest request) {

	  String[] sortBy = sort.split(",");
	  List<Order> allSortOrder = new ArrayList<Order>();
	  for( int i = 0; i <= sortBy.length - 1; i+=2)
	  {
	      String evalSort = sortBy[i];
	      String sortDirection = sortBy[i+1];
	      Sort.Direction evalDirection = replaceOrderStringThroughDirection(sortDirection);
	      allSortOrder.add(new Sort.Order(evalDirection,evalSort).ignoreCase());
	  }

    Specification<M> specification = getSpecificationFromModelAndExample(model, Example.of(model, getMatcher(model)));
    return ResponseEntity.ok().body(this.baseService.findAll(specification, PageRequest.of(page, size, Sort.by(allSortOrder))));
  }

  @PostMapping({""})
  @Operation(
			summary = "Create record",
			description = "Create a record",
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
  public ResponseEntity<String> create(@RequestBody M model, HttpServletRequest request) {
    M baseModel;
    try {
      if(model.getActive() == null) {
    	  model.setActive(true);
      }
      baseModel = this.baseService.save(model);
    } catch (Exception e) {
      log.error(null, e);
      return 
        ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body("Error Message");
    }
    return 
      ResponseEntity.status(HttpStatus.CREATED)
      .body(baseModel.getId().toString());
  }
  
  @PostMapping({"/saveAll"})
  @Operation(
			summary = "Save all record",
			description = "Save a list of record",
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
  public ResponseEntity<String> saveAll(@RequestBody List<M> models, HttpServletRequest request) {
    List<M> tempModels = new ArrayList<>();
    try {
      tempModels = this.baseService.saveAll(models, null);
    } catch (Exception e) {
      log.error(null, e);
      return 
        ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body("fail");
    } 
    return 
      ResponseEntity.status(HttpStatus.CREATED)
      .body("success");
  }
  
  @GetMapping({"/{id}"})
  @Operation(
			summary = "Get a record by id",
			description = "Retrieve a record by record id",
			parameters = {@Parameter(name = "id", description = "The id of the record to find.")},
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
  public ResponseEntity<M> find(@PathVariable T id) {
	return ResponseEntity.ok().body(this.baseService.findById(id));
  }
 
  @PutMapping({""})
  @Operation(
			summary = "Update a record",
			description = "Update a record exists in the database",
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
  public ResponseEntity<String> update(@RequestBody M model, HttpServletRequest request) {
	    try {
	    	if(model.getActive() == null) {
	    		model.setActive(true);
	    	}

	        this.baseService.update(model);
	      } catch (Exception e) {
	        log.error(null, e);
	      } 
    return ResponseEntity.status(HttpStatus.OK).body(model.getId().toString());
  }
 
  @DeleteMapping({""})
  @Operation(
			summary = "Delete record",
			description = "Delete any number of records by an id list",
			responses = {
				@ApiResponse(responseCode = "204", description = "No Content")
			})
  public ResponseEntity<String> delete(@RequestBody List<T> ids, HttpServletRequest request) {
	for (T id: ids) {
		this.baseService.deleteById(id);
	}
    return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Deleted " + ids.size() + " record(s).");
  }
  
  protected Specification<M> getSpecificationFromModelAndExample(
		  M model, Example<M> example
	) {
	  return (Specification<M>) (root, query, builder) -> {
		final List<Predicate> predicates = getPredicates(root, query, builder, model);
		if (includeSpecificationFromModel) {
		  predicates.add(QueryByExamplePredicateBuilder.getPredicate(root, builder, example));
		}
		return builder.and(predicates.toArray(new Predicate[predicates.size()]));
	};
  }
  
  protected List<Predicate> getPredicates(Root<M> root, CriteriaQuery<?> query, CriteriaBuilder builder, M model) {
    return new ArrayList<>();
  }
  
  public abstract void setControllerPrefix();

  public ResponseEntity<M> getOne(T id) {
	return ResponseEntity.ok().body(this.baseService.getOne(id));
  }

}
