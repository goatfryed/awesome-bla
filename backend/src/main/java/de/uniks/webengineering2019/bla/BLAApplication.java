package de.uniks.webengineering2019.bla;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketList;
import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.repositories.BucketListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

/**
 * Bucket List Application - BLA. pun intended.
 */
@SpringBootApplication
public class BLAApplication implements CommandLineRunner{

	public static void main(String[] args) {
		SpringApplication.run(BLAApplication.class, args);
	}


	@Autowired
	BucketListRepository bucketListRepository;

	@Override
	public void run(String... args){
		BucketList bucketList = BucketList.builder().createnDate(new Date()).lastUpdated(new Date()).title("Test Bucketlist").numEntries(0).build();
		bucketListRepository.save(bucketList);
		//System.out.println("Config is: "+configname);
	}
}
