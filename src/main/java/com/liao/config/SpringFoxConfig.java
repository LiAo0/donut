package com.liao.config;

import org.springframework.context.annotation.Configuration;

/**
 * Swagger2的Java配置类
 *
 * @author XiongNeng
 * @version 1.0
 * @since 2018/1/7
 */
@Configuration
/*@EnableSwagger2*/
public class SpringFoxConfig {

    /*@Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .produces(Sets.newHashSet("application/json"))
                .consumes(Sets.newHashSet("application/json"))
                .protocols(Sets.newHashSet("http", "https"))
                .apiInfo(apiInfo())
                .forCodeGeneration(true)
                .select()
                // 指定controller存放的目录路径
                .apis(RequestHandlerSelectors.basePackage("com.xncoding.jwt.api"))
//                .paths(PathSelectors.ant("/api/v1/*"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                // 文档标题
                .title("系统API服务")
                // 文档描述
                .description("系统API接口文档")
                // .termsOfServiceUrl("https://github.com/yidao620c")
                .version("v1")
                // .license("MIT 协议")
                // .licenseUrl("http://www.opensource.org/licenses/MIT")
                // .contact(new Contact("熊能","https://github.com/yidao620c","yidao620@gmail.com"))
                .build();
    }*/
}
