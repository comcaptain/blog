package sgq.web.pygmalion.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import sgq.web.pygmalion.enums.PrivilegeEnum;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Privilege {
	PrivilegeEnum[] requiredPrivileges();
}
