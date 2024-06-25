package com.jlimyt.spring_boot_sample_todo_application.annotation;

public class JsonViews {

	public interface Basic {}

	public class Role {

		public interface Public extends Basic {}

		public interface Clerk extends Public {}

		public interface Worker extends Clerk {}

		public interface Instrutor extends Basic {}

		public interface Admin extends Basic {}
	}

	public class RequestType {
		public interface Get extends Basic {}

		public interface Post extends Basic {}

		public interface Put extends Basic {}

		public interface Patch extends Basic {}

		public interface Search extends Basic {}
	}
}
