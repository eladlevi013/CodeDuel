
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static boolean isPrime(int num) {
	    boolean flag = true;
	
	  for(int i=2; i<num; i++) {
	    if (num % i == 0) {
	flag = false;}
	  }
	
	return flag;
	}
    
	    public static void main(String[] args) {
	        System.out.println(Objects.equals(isPrime(11), true) && 
			Objects.equals(isPrime(4), false) && 
			Objects.equals(isPrime(19), true));
	    }
}