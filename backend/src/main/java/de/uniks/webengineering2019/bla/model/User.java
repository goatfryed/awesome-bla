package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "users") // Postgress does not allow the reserved name user. Thanks to docker, we saw it directly!
@Getter
@Setter
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private String userName;
    private String fullName;

    @JsonIgnore
    @OneToMany(fetch=FetchType.LAZY,mappedBy="owner")
    private List<BucketList> bucketListLists;

    @Override
    public String toString(){
        return "id: "+id+" userName: "+userName+"fullName: "+fullName;
    }

    public User(){
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(userName, user.userName) &&
                Objects.equals(fullName, user.fullName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userName, fullName);
    }
}
