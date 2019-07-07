package de.uniks.webengineering2019.bla;

import java.util.Date;

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

	public static void main(String[] args) {
		SpringApplication.run(BLAApplication.class, args);
	}

	@Override
	public void run(String... args){
	}
}
