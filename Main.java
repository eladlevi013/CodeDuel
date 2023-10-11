
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static int findLargest(int[] nums) {
	  // write your java code here...
	}
    
	    public static void main(String[] args) {
	        System.out.println(Objects.equals(findLargest(new int[]{1,5,8,3}), 8) && 
			Objects.equals(findLargest(new int[]{12,4,5,9}), 12) && 
			Objects.equals(findLargest(new int[]{-1,-5,-8,-3}), -1) && 
			Objects.equals(findLargest(new int[]{-12,0,-15,20}), 20) && 
			Objects.equals(findLargest(new int[]{100,200,300,400}), 400));
	    }
}