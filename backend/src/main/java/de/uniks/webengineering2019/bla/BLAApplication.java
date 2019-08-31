package de.uniks.webengineering2019.bla;

import java.util.Date;

import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import de.uniks.webengineering2019.bla.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;

/**
 * Bucket List Application - BLA. pun intended.
 */
@SpringBootApplication
public class BLAApplication implements CommandLineRunner{

	private static final Logger LOG = LoggerFactory.getLogger(AuthenticationService.class);


	public static void main(String[] args) {
		SpringApplication.run(BLAApplication.class, args);
	}

	@Autowired
	private BucketListRepository bucketListRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public void run(String... args){
		for(String arg:args){
			if(arg.equals("paging_test")){
				LOG.info("Profile Page Testing is active test lists will be created");
				/*User user = userRepository.findByUserNameIgnoreCaseContaining("Test User 1",0).getContent().get(0);
				for(long i=0;i<40;i++){
					BucketList bucketList = BucketList.builder()
							.creationDate(new Date())
							.lastUpdated(new Date())
							.privateList(true)
							.description("Beschreibung für generierte Liste "+i)
							.title("Title für generierte liste "+i)
							.numEntries(0)
							.id(i)
							.owner(user).build();
					bucketListRepository.save(bucketList);
				}*/
			}
		}
	}
}
